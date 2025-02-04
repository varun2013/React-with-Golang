import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import { TableProps } from "../../../types/table.type";

const CommonTable: React.FC<TableProps> = ({
  columns,
  data,
  sortColumn,
  sortDirection,
  onSort,
  onPageChange,
  totalPages,
  currentPage,
  renderActions,
  totalRecords,
}) => {
  return (
    <>
      <div className="table-responsive custom-table-scroll">
        <table className="table datanew common-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={
                    column.sortable && sortColumn === column.key
                      ? sortDirection
                      : ""
                  }
                  onClick={() => column.sortable && onSort(column.key)}
                >
                  <div className={`d-flex gap-3 ${column?.headerClassName}`}>
                    {column.label}
                    {column.sortable && (
                      <span className="dt-column-order">
                        <FontAwesomeIcon icon={faChevronUp} />
                        <FontAwesomeIcon icon={faChevronDown} />
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {renderActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      title={item[column.key]}
                      className={column.className}
                    >
                      {column?.render
                        ? column.render(item[column.key], item)
                        : item[column.key]}
                    </td>
                  ))}
                  {renderActions && <td>{renderActions(item)}</td>}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (renderActions ? 1 : 0)}
                  className="text-center"
                >
                  No Records Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {data.length > 0 && (
        <div className="d-flex gap-3 mt-3 align-items-center justify-content-between flex-wrap">
          <span>
            <b>Total Records:</b> {totalRecords}
          </span>
          {totalPages > 1 && (
            <div className="pagination">
              <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={onPageChange}
                pageCount={totalPages}
                previousLabel="<"
                forcePage={currentPage - 1}
                // pageRangeDisplayed={5}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CommonTable;
