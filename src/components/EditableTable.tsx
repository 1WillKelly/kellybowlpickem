import React from "react";

interface EditableTableProps<TData> {
  columnNames: readonly string[];
  items?: readonly TData[];
  renderItem: (item: TData) => React.ReactNode[];
  editItem: (item: TData) => void;
  deleteItem?: (item: TData) => void;
  loading?: boolean;
}

const EditableTable = <TData,>(props: EditableTableProps<TData>) => {
  return (
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {props.columnNames.map((columnName, idx) => (
                    <th
                      key={idx}
                      scope="col"
                      className={`py-3.5 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6 ${
                        idx === 0 ? "pr-3" : "px-3"
                      }`}
                    >
                      {columnName}
                    </th>
                  ))}
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {(props.items ?? []).map((item, itemIdx) => (
                  <tr
                    key={itemIdx}
                    className={itemIdx % 2 === 0 ? undefined : "bg-gray-50"}
                  >
                    {props.renderItem(item).map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className={`whitespace-nowrap py-4 pl-4 text-sm ${
                          cellIdx === 0
                            ? "pr-3 font-medium text-gray-900 sm:pl-6"
                            : "px-3 text-gray-500 sm:pr-6"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                    <td className="relative space-x-2 whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => props.editItem(item)}
                      >
                        Edit
                      </button>

                      {props.deleteItem && (
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() =>
                            props.deleteItem && props.deleteItem(item)
                          }
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditableTable;
