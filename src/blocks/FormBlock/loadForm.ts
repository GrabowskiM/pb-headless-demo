import type { BlockData } from '@ibexa/cohesivo-sdk-react-headless';

import { restFetch } from '#/rest';

import { attribute as blockAttribute } from '../attribute';

export interface FormField {
    defaultValue: string;
    help: string;
    identifier: string;
    label: string;
    placeholder: string;
    required: boolean;
    type: string;
}

export interface FormDefinition {
    fields: FormField[];
    submitLabel: string;
    successMessage: string;
}

interface RawAttribute {
    identifier: string;
    value: string | null;
}

interface RawValidator {
    identifier: string;
    value: string | null;
}

interface RawField {
    attributes: RawAttribute[];
    identifier: string;
    name: string;
    type: string;
    validators: RawValidator[];
}

interface FormFieldValue {
    fields: RawField[];
}

interface VersionResponse {
    Version: {
        Fields: { field: { fieldTypeIdentifier: string; fieldValue: unknown }[] };
    };
}

const isFormValue = (value: unknown): value is FormFieldValue =>
    typeof value === 'object' && value !== null && 'fields' in value && Array.isArray(value.fields);

const attribute = (field: RawField, identifier: string): string =>
    field.attributes.find((candidate) => candidate.identifier === identifier)?.value ?? '';

const isRequired = (field: RawField): boolean =>
    field.validators.some((validator) => validator.identifier === 'required' && validator.value === '');

const parseSuccessMessage = (button: RawField | undefined): string => {
    const action = button && attribute(button, 'action');

    if (!action) {
        return 'Submitted.';
    }

    try {
        const parsed: unknown = JSON.parse(action);

        return typeof parsed === 'object' && parsed !== null && 'message' in parsed && typeof parsed.message === 'string'
            ? parsed.message
            : 'Submitted.';
    } catch {
        return 'Submitted.';
    }
};

const RENDERED_TYPES = new Set(['single_line', 'email', 'multi_line']);

export const loadForm = async (block: BlockData): Promise<FormDefinition | null> => {
    const contentId = blockAttribute(block, 'contentId');

    if (!contentId) {
        return null;
    }

    const { Version } = await restFetch<VersionResponse>(
        `/api/ibexa/v2/content/objects/${contentId}/currentversion`,
        'application/vnd.ibexa.api.Version+json',
    );
    const formValue = Version.Fields.field.find((field) => field.fieldTypeIdentifier === 'ibexa_form')?.fieldValue;

    if (!isFormValue(formValue)) {
        return null;
    }

    const button = formValue.fields.find((field) => field.identifier === 'button');
    const fields = formValue.fields
        .filter((field) => RENDERED_TYPES.has(field.identifier))
        .map((field) => ({
            defaultValue: attribute(field, 'default_value'),
            help: attribute(field, 'help'),
            identifier: field.identifier,
            label: field.name,
            placeholder: attribute(field, 'placeholder'),
            required: isRequired(field),
            type: field.identifier,
        }));

    return {
        fields,
        submitLabel: button?.name ?? 'Submit',
        successMessage: parseSuccessMessage(button),
    };
};
