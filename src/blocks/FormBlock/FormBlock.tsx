import { useState } from 'react';

import type { BlockWithData } from '#/blockData';
import { useBlockData } from '#/blockDataContext';

import type { FormDefinition, FormField } from './loadForm';

interface FormBlockProps {
    block: BlockWithData;
}

const isFormDefinition = (value: unknown): value is FormDefinition => typeof value === 'object' && value !== null && 'fields' in value;

const FieldControl = ({ field }: { field: FormField }) => {
    const id = `form-field-${field.identifier}`;
    const shared = {
        defaultValue: field.defaultValue,
        id,
        name: field.identifier,
        placeholder: field.placeholder,
        required: field.required,
    };

    return (
        <p className="form-field">
            <label htmlFor={id}>
                {field.label}
                {field.required ? <span aria-hidden="true"> *</span> : null}
            </label>
            {field.type === 'multi_line' ? (
                <textarea {...shared} rows={5} />
            ) : (
                <input {...shared} type={field.type === 'email' ? 'email' : 'text'} />
            )}
            {field.help ? <small>{field.help}</small> : null}
        </p>
    );
};

export const FormBlock = ({ block }: FormBlockProps) => {
    const [submitted, setSubmitted] = useState(false);

    const data = useBlockData(block);

    if (!isFormDefinition(data)) {
        return null;
    }

    const { fields, submitLabel, successMessage } = data;

    return (
        <form
            className="block-form"
            onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
            }}
        >
            <h2>{block.name}</h2>
            {fields.map((field) => (
                <FieldControl field={field} key={field.identifier} />
            ))}
            <button type="submit">{submitLabel}</button>
            {submitted ? (
                <p className="block-form__success" role="status">
                    {successMessage}
                </p>
            ) : null}
        </form>
    );
};
