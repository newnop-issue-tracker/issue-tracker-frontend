import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/UI/Avatar';
import { Button } from '@/components/UI/Button';
import { Icon } from '@/components/UI/Icon';
import {
  PriorityBadge,
  StatusBadge,
  StatusIcon,
} from '@/components/UI/Badge';
import { IssuesListSkeleton } from '@/components/UI/Skeleton';
import { useIssues } from '@/features/issues/hooks';
import { useDebounce } from '@/hooks/useDebounce';
import { useTicker } from '@/hooks/useTicker';
import { timeAgo, truncate } from '@/lib/formatters';
import {
  priorityApiToUi,
  priorityUiToApi,
  severityUiToApi,
  statusApiToUi,
  statusUiToApi,
  type Priority,
  type PriorityKey,
  type Severity,
  type SeverityKey,
  type Status,
  type StatusKey,
} from '@/types/api';
import {
  PRIORITY_OPTIONS,
  SEVERITY_OPTIONS,
  STATUS_OPTIONS,
} from '@/lib/constants';

interface IssuesListPageProps {
  onCreate: () => void;
}

interface FilterSectionProps<T extends string> {
  title: string;
  options: Array<{ value: T; label: string; icon?: React.ReactNode }>;
  selected: T[];
  onChange: (next: T[]) => void;
}

function FilterSection<T extends string>({
  title,
  options,
  selected,
  onChange,
}: FilterSectionProps<T>) {
  return (
    <div className="filter-group">
      <div className="filter-group-title">{title}</div>
      {options.map((opt) => (
        <label key={opt.value} className="filter-row">
          <input
            type="checkbox"
            checked={selected.includes(opt.value)}
            onChange={(e) => {
              const next = e.target.checked
                ? [...selected, opt.value]
                : selected.filter((v) => v !== opt.value);
              onChange(next);
            }}
          />
          {opt.icon}
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

export function IssuesListPage({ onCreate }: IssuesListPageProps) {
  useTicker(20_000);
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusKey[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<PriorityKey[]>([]);
  const [severityFilter, setSeverityFilter] = useState<SeverityKey[]>([]);
  const [sort, setSort] = useState<'updatedAt' | 'createdAt' | 'priority' | 'status'>('updatedAt');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, priorityFilter, severityFilter, sort]);

  const apiStatus: Status | undefined = statusFilter[0]
    ? statusUiToApi[statusFilter[0]]
    : undefined;
  const apiPriority: Priority | undefined = priorityFilter[0]
    ? priorityUiToApi[priorityFilter[0]]
    : undefined;
  const apiSeverity: Severity | undefined = severityFilter[0]
    ? severityUiToApi[severityFilter[0]]
    : undefined;

  const query = useIssues({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    status: apiStatus,
    priority: apiPriority,
    severity: apiSeverity,
    sortBy: sort,
    sortOrder: 'desc',
  });

  const issues = query.data?.data ?? [];
  const total = query.data?.pagination.total ?? 0;
  const pageCount = query.data?.pagination.totalPages ?? 1;

  const clearAll = () => {
    setStatusFilter([]);
    setPriorityFilter([]);
    setSeverityFilter([]);
    setSearch('');
  };

  const hasFilters =
    statusFilter.length > 0 ||
    priorityFilter.length > 0 ||
    severityFilter.length > 0 ||
    search.length > 0;

  const activeFilterCount =
    statusFilter.length + priorityFilter.length + severityFilter.length;

  return (
    <div className="main-wrap">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Issues</h1>
          <p className="page-subtitle">
            {total} {total === 1 ? 'issue' : 'issues'}
            {hasFilters ? ' matching filters' : ''}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onCreate}
          icon={<Icon.Plus size={14} />}
        >
          Create issue
        </Button>
      </div>

      {/* Toolbar — always above the grid, full width */}
      <div className="issues-toolbar">
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            className="input"
            placeholder="Search by title or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 36, fontSize: 14 }}
          />
          <Icon.Search
            size={15}
            style={{
              position: 'absolute',
              left: 11,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--fg-subtle)',
              pointerEvents: 'none',
            }}
          />
        </div>
        <select
          className="input select issues-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
        >
          <option value="updatedAt">Last updated</option>
          <option value="createdAt">Newest</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
        </select>
        {/* Mobile filter toggle */}
        <button
          className="filter-toggle-btn"
          onClick={() => setFiltersOpen((o) => !o)}
        >
          <Icon.Filter size={15} />
          Filters
          {activeFilterCount > 0 && (
            <span className="filter-toggle-badge">{activeFilterCount}</span>
          )}
        </button>
        {hasFilters && (
          <button className="clear-filters-btn" onClick={clearAll}>
            Clear
          </button>
        )}
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="card mobile-filter-drawer">
          <FilterSection<StatusKey>
            title="Status"
            selected={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_OPTIONS.map((s) => ({
              value: s,
              label:
                s === 'progress'
                  ? 'In Progress'
                  : s.charAt(0).toUpperCase() + s.slice(1),
              icon: <StatusIcon status={s} size={13} />,
            }))}
          />
          <FilterSection<PriorityKey>
            title="Priority"
            selected={priorityFilter}
            onChange={setPriorityFilter}
            options={PRIORITY_OPTIONS.map((p) => ({
              value: p,
              label: p.charAt(0).toUpperCase() + p.slice(1),
            }))}
          />
          <FilterSection<SeverityKey>
            title="Severity"
            selected={severityFilter}
            onChange={setSeverityFilter}
            options={SEVERITY_OPTIONS.map((s) => ({
              value: s,
              label: s.charAt(0).toUpperCase() + s.slice(1),
            }))}
          />
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearAll} style={{ marginTop: 12, width: '100%' }}>
              Clear all filters
            </Button>
          )}
        </div>
      )}

      {/* Main layout */}
      <div className="list-layout">
        {/* Desktop filter sidebar */}
        <div className="card filter-panel desktop-only-filter">
          <FilterSection<StatusKey>
            title="Status"
            selected={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_OPTIONS.map((s) => ({
              value: s,
              label:
                s === 'progress'
                  ? 'In Progress'
                  : s.charAt(0).toUpperCase() + s.slice(1),
              icon: <StatusIcon status={s} size={13} />,
            }))}
          />
          <FilterSection<PriorityKey>
            title="Priority"
            selected={priorityFilter}
            onChange={setPriorityFilter}
            options={PRIORITY_OPTIONS.map((p) => ({
              value: p,
              label: p.charAt(0).toUpperCase() + p.slice(1),
            }))}
          />
          <FilterSection<SeverityKey>
            title="Severity"
            selected={severityFilter}
            onChange={setSeverityFilter}
            options={SEVERITY_OPTIONS.map((s) => ({
              value: s,
              label: s.charAt(0).toUpperCase() + s.slice(1),
            }))}
          />
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              style={{ marginTop: 16, width: '100%' }}
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Issues list */}
        <div>
          <div className="card" style={{ overflow: 'hidden' }}>
            {query.isLoading ? (
              <IssuesListSkeleton />
            ) : query.isError ? (
              <div className="empty">
                <Icon.AlertTri size={40} />
                <div className="empty-title" style={{ marginTop: 10 }}>
                  Couldn't load issues
                </div>
                <p style={{ maxWidth: 340, margin: '6px auto 18px', fontSize: 14 }}>
                  Something went wrong fetching the list. Try again in a moment.
                </p>
                <Button variant="secondary" size="sm" onClick={() => query.refetch()}>
                  Retry
                </Button>
              </div>
            ) : issues.length === 0 ? (
              <div className="empty">
                <Icon.Inbox size={48} sw={1.2} />
                <div className="empty-title" style={{ marginTop: 12 }}>
                  No issues match these filters
                </div>
                <p style={{ maxWidth: 340, margin: '6px auto 18px', fontSize: 14 }}>
                  Try loosening filters, or create a new issue to get started.
                </p>
                {hasFilters ? (
                  <Button variant="secondary" size="sm" onClick={clearAll}>
                    Clear filters
                  </Button>
                ) : (
                  <Button variant="primary" size="sm" onClick={onCreate}>
                    Create issue
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table" style={{ minWidth: 560 }}>
                    <thead>
                      <tr>
                        <th style={{ width: 32 }}></th>
                        <th style={{ width: 90 }}>ID</th>
                        <th>Title</th>
                        <th style={{ width: 110 }}>Status</th>
                        <th style={{ width: 100 }}>Priority</th>
                        <th style={{ width: 52 }}>Author</th>
                        <th style={{ width: 95 }}>Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {issues.map((i) => (
                        <tr
                          key={i.id}
                          onClick={() => navigate(`/issues/${i.id}`)}
                        >
                          <td>
                            <StatusIcon status={statusApiToUi[i.status]} size={15} />
                          </td>
                          <td className="mono text-subtle" style={{ fontSize: 12 }}>
                            {i.id.slice(0, 8)}
                          </td>
                          <td>
                            <span
                              style={{
                                maxWidth: 440,
                                fontWeight: 500,
                                display: 'block',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                fontSize: 14,
                              }}
                            >
                              {truncate(i.title, 90)}
                            </span>
                          </td>
                          <td>
                            <StatusBadge status={statusApiToUi[i.status]} />
                          </td>
                          <td>
                            <PriorityBadge priority={priorityApiToUi[i.priority]} />
                          </td>
                          <td>
                            <Avatar user={i.author} />
                          </td>
                          <td className="text-subtle mono" style={{ whiteSpace: 'nowrap', fontSize: 12 }}>
                            {timeAgo(i.updatedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="pagination">
                  <span style={{ fontSize: 13 }}>
                    Showing <b>{(page - 1) * 10 + 1}</b>–
                    <b>{Math.min(page * 10, total)}</b> of <b>{total}</b>
                  </span>
                  <div className="pagination-pages">
                    <button
                      className="page-btn"
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      <Icon.ChevLeft size={14} />
                    </button>
                    {Array.from({ length: Math.min(pageCount, 10) }).map((_, idx) => (
                      <button
                        key={idx}
                        className="page-btn"
                        data-on={page === idx + 1}
                        onClick={() => setPage(idx + 1)}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button
                      className="page-btn"
                      disabled={page === pageCount}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <Icon.ChevRight size={14} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
