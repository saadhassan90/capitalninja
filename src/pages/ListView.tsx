
import { useParams } from "react-router-dom";
import { ListInvestorsTable } from "@/components/lists/ListInvestorsTable";

const ListView = () => {
  const { id } = useParams();
  
  if (!id) {
    return <div>List ID is required</div>;
  }

  return (
    <div className="p-8">
      <ListInvestorsTable listId={id} />
    </div>
  );
};

export default ListView;
