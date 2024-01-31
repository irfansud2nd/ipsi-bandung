const TabelKontingen = () => {
  // EVENTID TRUE
  return (
    <table className="mb-1">
      <thead>
        <tr>
          <th>Nama Kontingen</th>
          <th>Jumlah Official</th>
          <th>Jumlah Peserta</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Kontingen 1</td>
          <td>1</td>
          <td>3</td>
          <td>Edit | Hapus</td>
        </tr>
      </tbody>
    </table>
  );
};
export default TabelKontingen;
