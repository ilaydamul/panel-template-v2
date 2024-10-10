import { DataTable } from "primereact/datatable";
import React from "react";

export default function DTable({ data, children }) {
  return (
    <>
      <DataTable
        value={data}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "50rem" }}
        emptyMessage="Kayıt Bulunamadı"
      >
        {children}
      </DataTable>
    </>
  );
}