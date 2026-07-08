import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  AgentActionCard,
  AgentApprovalRequest,
  AgentProtocolEvent,
  AgentRecommendation,
  AgentRenderBlock,
  AgentSafetyEvaluation,
  AgentSessionSnapshot,
  createAgentSessionStateFromSnapshot,
} from '../../../../core/agentic/domain';
import { IncidentAgentPanel } from './incident-agent-panel';

const startResponseCard: AgentActionCard = {
  id: 'INC-001-start-response',
  title: 'Prepare response start',
  summary: 'Move from acknowledged ownership to active operational response.',
  intent: 'start-response',
  targetType: 'incident',
  targetId: 'INC-001',
  riskLevel: 'medium',
  requiresApproval: false,
  evidence: ['The incident is already acknowledged.'],
};

const snapshot: AgentSessionSnapshot = {
  id: 'agent-session-INC-001',
  title: 'Operations assistant',
  subtitle: 'Advisory support for the selected incident',
  mode: 'advisory',
  context: [
    { label: 'Incident', value: 'INC-001' },
    { label: 'Asset', value: 'TRF-001' },
  ],
  cards: [startResponseCard],
  safetyNotes: ['The assistant can suggest actions, but the operator keeps control.'],
  generatedAt: '2026-07-07T00:00:00.000Z',
};

const toolResult = {
  id: 'agent-session-INC-001:read-selected-incident:2026-07-07T09:00:00.000Z',
  sessionId: 'agent-session-INC-001',
  toolName: 'read-selected-incident',
  title: 'Read selected incident',
  summary: 'Selected incident INC-001 is Open.',
  permission: 'read-only' as const,
  facts: ['Status is Open.'],
  at: '2026-07-07T09:00:00.000Z',
};

const recommendation: AgentRecommendation = {
  id: 'agent-session-INC-001:recommendation:approval-boundary',
  title: 'Keep approval boundary visible',
  summary: 'One proposed action needs human approval.',
  priority: 'review',
  evidence: ['Prepare response start: medium.'],
  source: 'snapshot',
};

const approvalRequest: AgentApprovalRequest = {
  id: 'agent-session-INC-001:approval:INC-001-start-response',
  sessionId: 'agent-session-INC-001',
  cardId: 'INC-001-start-response',
  title: 'Prepare response start',
  summary: 'Move to active operational response.',
  riskLevel: 'medium',
  status: 'pending',
  evidence: ['Response start changes workflow state.'],
  requestedAt: '2026-07-07T09:01:00.000Z',
};

const renderBlock: AgentRenderBlock = {
  id: 'agent-session-INC-001:approval:INC-001-start-response:block',
  type: 'approval-request',
  title: 'Prepare response start',
  body: 'Move to active operational response.',
  variant: 'warning',
  facts: ['Response start changes workflow state.'],
  actions: [],
};

const safetyEvaluation: AgentSafetyEvaluation = {
  id: 'agent-session-INC-001:safety-evaluation',
  sessionId: 'agent-session-INC-001',
  status: 'review',
  score: 75,
  checks: [
    {
      id: 'approval-coverage',
      title: 'Approval coverage',
      status: 'review',
      message: 'One approval-required card has not been reviewed yet.',
    },
  ],
};

const protocolEvent: AgentProtocolEvent = {
  id: 'agent-session-INC-001:protocol:state.snapshot',
  type: 'state.snapshot',
  sessionId: 'agent-session-INC-001',
  at: '2026-07-07T09:00:00.000Z',
  payload: {},
};

describe('IncidentAgentPanel', () => {
  let fixture: ComponentFixture<IncidentAgentPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentAgentPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentAgentPanel);
  });

  it('renders selected incident context and action cards', () => {
    fixture.componentRef.setInput('snapshot', snapshot);
    fixture.componentRef.setInput('sessionState', createAgentSessionStateFromSnapshot(snapshot));
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Operations assistant');
    expect(element.textContent).toContain('TRF-001');
    expect(element.textContent).toContain('Prepare response start');
    expect(element.textContent).toContain('Operator controlled');
    expect(element.textContent).toContain('Event timeline');
    expect(element.textContent).toContain('Action card proposed: Prepare response start');
    expect(element.textContent).toContain('Run client tools');
  });

  it('emits the selected action card without executing it directly', () => {
    const selectedCards: AgentActionCard[] = [];
    fixture.componentRef.setInput('snapshot', snapshot);
    fixture.componentInstance.cardSelected.subscribe((card) => selectedCards.push(card));
    fixture.detectChanges();

    [...(fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.includes('Review action'))
      ?.click();

    expect(selectedCards).toEqual([startResponseCard]);
  });

  it('emits a request to run client-side tools and renders tool results', () => {
    let requested = false;
    fixture.componentRef.setInput('snapshot', snapshot);
    fixture.componentRef.setInput('toolResults', [toolResult]);
    fixture.componentInstance.toolsRequested.subscribe(() => {
      requested = true;
    });
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>('.agent-panel__tools-heading button')?.click();

    expect(requested).toBe(true);
    expect(element.textContent).toContain('Read selected incident');
    expect(element.textContent).toContain('Selected incident INC-001 is Open.');
  });

  it('renders approval, safety and protocol sections without mutating state directly', () => {
    let decision:
      | { readonly requestId: string; readonly decision: 'approved' | 'rejected' }
      | null = null;
    fixture.componentRef.setInput('snapshot', snapshot);
    fixture.componentRef.setInput('recommendations', [recommendation]);
    fixture.componentRef.setInput('renderBlocks', [renderBlock]);
    fixture.componentRef.setInput('approvalRequests', [approvalRequest]);
    fixture.componentRef.setInput('safetyEvaluation', safetyEvaluation);
    fixture.componentRef.setInput('protocolEvents', [protocolEvent]);
    fixture.componentInstance.approvalDecisionRequested.subscribe((event) => {
      decision = event;
    });
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    element
      .querySelector<HTMLButtonElement>('.agent-panel__tools--approval button')
      ?.click();

    expect(element.textContent).toContain('Keep approval boundary visible');
    expect(element.textContent).toContain('Approval queue');
    expect(element.textContent).toContain('Safety evaluation');
    expect(element.textContent).toContain('AG-UI/A2UI bridge');
    expect(decision).toEqual({
      requestId: 'agent-session-INC-001:approval:INC-001-start-response',
      decision: 'approved',
    });
  });
});
