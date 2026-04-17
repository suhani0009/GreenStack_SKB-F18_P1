function Panel({ title, subtitle, actions, children, className = "" }) {
  return (
    <section className={`panel-surface p-6 ${className}`}>
      {(title || subtitle || actions) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title ? <h3 className="section-title">{title}</h3> : null}
            {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}

export default Panel;
