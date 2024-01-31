const TabelKontingenLama = () => {
  // EVENTID FALSE
  return (
    <table className="mt-1">
      <thead>
        <tr>
          <th>No</th>
          <th>Nama Kontingen</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Kontingen 1 Lama</td>
          <td>
            <button className="btn_green my-1">Tambahkan</button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
export default TabelKontingenLama;
