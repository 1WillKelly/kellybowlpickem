import AdminLayout from "components/layouts/AdminLayout";
import { type NextPage } from "next";
import { trpc } from "utils/trpc";

const AdminIndexPage: NextPage = () => {
  const { isLoading, data } = trpc.admin.whoAmI.useQuery();
  console.log("Who am i", data);
  const content = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    return <div>Hello admin: {data?.name}</div>;
  };
  return <AdminLayout>{content()}</AdminLayout>;
};

export default AdminIndexPage;
