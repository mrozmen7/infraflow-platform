import { Component, computed, inject, signal } from '@angular/core';
import {
  form,
  FormField,
  FormRoot,
  maxLength,
  minLength,
  pattern,
  required,
  validate,
} from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';

import {
  type IncidentPriority,
  type IncidentSeverity,
  incidentSeverities,
} from '../../domain/incident';
import { IncidentStore } from '../../state/incident-store';

interface IncidentFormModel {
  readonly title: string;
  readonly description: string;
  readonly location: string;
  readonly assetId: string;
  readonly severity: IncidentSeverity;
  readonly priority: IncidentPriority;
  readonly immediateRisk: boolean;
  readonly operationalSignals: string;
}

const incidentPriorities: readonly IncidentPriority[] = ['P1', 'P2', 'P3', 'P4'];
const assetIdPattern = /^[A-Z]{2,5}-[A-Z0-9]+(?:-[A-Z0-9]+)*$/;

@Component({
  selector: 'app-incident-create-page',
  imports: [FormField, FormRoot, RouterLink],
  templateUrl: './incident-create-page.html',
  styleUrl: './incident-create-page.scss',
})
export class IncidentCreatePage {
  private readonly incidentStore = inject(IncidentStore);
  private readonly router = inject(Router);

  protected readonly severityOptions = incidentSeverities;
  protected readonly priorityOptions = incidentPriorities;
  protected readonly incidentModel = signal<IncidentFormModel>(createInitialFormModel());

  protected readonly incidentForm = form(
    this.incidentModel,
    (path) => {
      required(path.title, { message: 'Title is required.' });
      minLength(path.title, 8, { message: 'Title must contain at least 8 characters.' });
      maxLength(path.title, 120, { message: 'Title cannot exceed 120 characters.' });

      required(path.description, { message: 'Description is required.' });
      minLength(path.description, 20, {
        message: 'Description must contain at least 20 characters.',
      });
      maxLength(path.description, 1000, {
        message: 'Description cannot exceed 1000 characters.',
      });

      required(path.location, { message: 'Location is required.' });
      minLength(path.location, 3, { message: 'Location must contain at least 3 characters.' });

      required(path.assetId, { message: 'Asset ID is required.' });
      pattern(path.assetId, assetIdPattern, {
        message: 'Use an Asset ID such as TRF-NT-003.',
      });

      maxLength(path.operationalSignals, 300, {
        message: 'Operational signals cannot exceed 300 characters.',
      });

      required(path.immediateRisk, {
        message: 'Critical incidents require immediate safety risk confirmation.',
        when: ({ valueOf }) => valueOf(path.severity) === 'Critical',
      });

      validate(path.priority, ({ value, valueOf }) => {
        const severity = valueOf(path.severity);

        if (severity === 'Critical' && value() !== 'P1') {
          return {
            kind: 'critical-priority',
            message: 'Critical incidents must use priority P1.',
          };
        }

        if (severity === 'High' && value() === 'P4') {
          return {
            kind: 'high-priority',
            message: 'High severity incidents cannot use priority P4.',
          };
        }

        return null;
      });
    },
    {
      submission: {
        action: async (field) => {
          const value = field().value();

          try {
            const incident = await this.incidentStore.createIncident({
              title: value.title,
              description: value.description,
              location: value.location,
              assetId: value.assetId,
              severity: value.severity,
              priority: value.priority,
              operationalSignals: parseOperationalSignals(value.operationalSignals),
            });

            await this.router.navigate(['/incidents', incident.id]);
            return undefined;
          } catch {
            return {
              kind: 'server',
              message: 'The incident could not be created. Review the data and try again.',
            };
          }
        },
        onInvalid: (field) => {
          field().errorSummary()[0]?.fieldTree().focusBoundControl();
        },
        ignoreValidators: 'none',
      },
    },
  );

  protected readonly hasDraftChanges = computed(() => this.incidentForm().dirty());

  protected resetDraft(): void {
    this.incidentForm().reset(createInitialFormModel());
  }
}

function createInitialFormModel(): IncidentFormModel {
  return {
    title: '',
    description: '',
    location: '',
    assetId: '',
    severity: 'Medium',
    priority: 'P2',
    immediateRisk: false,
    operationalSignals: '',
  };
}

function parseOperationalSignals(value: string): readonly string[] {
  return value
    .split(/[,;\n]/)
    .map((operationalSignal) => operationalSignal.trim())
    .filter(Boolean);
}
