type Props = {
  handleDelete: () => void;
  handleEdit: () => void;
  disabled: boolean;
};
const TabelActionButtons = ({ handleEdit, handleDelete, disabled }: Props) => {
  return (
    <td>
      <div className="flex gap-1">
        <button
          className="btn_green text-sm"
          disabled={disabled}
          onClick={handleEdit}
        >
          Edit
        </button>
        <button
          className="btn_red text-sm"
          disabled={disabled}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </td>
  );
};
export default TabelActionButtons;
