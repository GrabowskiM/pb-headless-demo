import type { ContentListItem } from './loadContentListItems';

interface PersonCardProps {
    item: ContentListItem;
}

const text = (value: unknown): string => (typeof value === 'string' ? value : '');

export const PersonCard = ({ item }: PersonCardProps) => {
    const { fields, name, thumbnail } = item;
    const fullName = `${text(fields.first_name)} ${text(fields.last_name)}`.trim() || name;
    const email = text(fields.email);
    const telephone = text(fields.telephone);

    return (
        <li className="person-card">
            {thumbnail ? (
                <img
                    alt={fullName}
                    className="person-card__photo"
                    height={thumbnail.height}
                    src={thumbnail.resource}
                    width={thumbnail.width}
                />
            ) : (
                <span className="person-card__photo person-card__photo--empty" />
            )}
            <h3 className="person-card__name">{fullName}</h3>
            <p className="person-card__position">{text(fields.position)}</p>
            <p className="person-card__contact">
                {email ? <a href={`mailto:${email}`}>{email}</a> : null}
                {telephone ? <span>{telephone}</span> : null}
            </p>
        </li>
    );
};
