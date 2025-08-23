import { getMenu } from '@/lib/restaurantData';

export default function AllergenNotice({ compact = false }: { compact?: boolean }) {
  const menu = getMenu();
  const meta = menu?.metadata;
  const statement = meta?.allergen_info || 'Please inform us of any allergies before ordering.';
  const disclaimer = meta?.disclaimer || 'Cross-contamination is possible despite care.';
  return (
    <div className={`text-xs ${compact ? 'mt-4' : 'mt-8'} text-neutral-100 leading-relaxed`}>
      <p><strong>Allergens:</strong> {statement}</p>
      {!compact && (
        <>
          <p>{disclaimer}</p>
          {meta?.notes?.length ? (
            <ul className="list-disc pl-4 mt-2 space-y-0.5">
              {meta.notes.slice(0,3).map((n, i) => <li key={i}>{n}</li>)}
            </ul>
          ) : null}
        </>
      )}
    </div>
  );
}
