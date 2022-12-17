import React from "react";
import styles from "./index.module.scss";

interface StandingsTableProps<TData> {
  columnNames: () => React.ReactNode[];
  items?: readonly TData[];
  renderItem: (item: TData) => React.ReactNode[];
  loading?: boolean;
  individualtandings?: boolean;
}

const StandingsTable = <TData,>(props: StandingsTableProps<TData>) => {
  return (
    <div
      className={`
    ${styles.view}
    ${
      props.individualtandings
        ? styles["individual-standings"]
        : styles["team-standings"]
    }
`}
    >
      <div className={styles["table-wrapper"]}>
        {props.individualtandings ? "" : ""}
        <table className={styles["standings-table"]}>
          <thead>
            <tr>
              {/** Standings place -- invisible header */}
              <th
                className={`
                  ${styles["sticky-col"]}
                  ${styles["first-col"]}
                `}
              ></th>
              {props.columnNames().map((header, idx) => (
                <th
                  key={idx}
                  className={
                    idx === 0
                      ? `${styles["sticky-col"]} ${styles["second-col"]}`
                      : undefined
                  }
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {props.loading ? (
              <tr>
                <td colSpan={3}>Loading...</td>
              </tr>
            ) : (
              props.items?.map((item, idx) => (
                <tr key={idx}>
                  <td
                    className={[
                      styles["sticky-col"],
                      styles["first-col"],
                      styles["rank"],
                    ].join(" ")}
                  >
                    {idx + 1}
                  </td>
                  {props.renderItem(item).map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className={
                        cellIdx === 0
                          ? [
                              styles["sticky-col"],
                              styles["second-col"],
                              styles["name"],
                            ].join(" ")
                          : undefined
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StandingsTable;
