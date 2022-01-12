import React from "react";
import { unseatTable } from "../utils/api";

import { useHistory } from "react-router-dom";

const Tables = ({ table }) => {
  const history = useHistory();

  let occupied = table.reservation_id;

  // finish table clickHandler
  async function clickHandler(tableId) {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      await unseatTable(tableId);
      history.go("/");
    }
  }

  return (
    <>
      <div className="res">
        <table>
          <tbody>{table.table_name}</tbody>
          <tbody>Capacity: {table.capacity}</tbody>
          {(!occupied && (
            <tbody data-table-id-status={table.table_id}>Free</tbody>
          )) || <tbody data-table-id-status={table.table_id}>Occupied</tbody>}

          {occupied && (
            <button
              className="m-1 btn btn-info"
              onClick={() => clickHandler(table.table_id)}
              data-table-id-finish={table.table_id}
            >
              Finish
            </button>
          )}
        </table>
      </div>
    </>
  );
};

export default Tables;
