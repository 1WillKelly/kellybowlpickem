import AdminLayout from "components/layouts/AdminLayout";
import { type NextPage } from "next";
import { trpc } from "utils/trpc";

const AdminIndexPage: NextPage = () => {
  const { isLoading, data } = trpc.admin.whoAmI.useQuery();

  const content = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    return <div className="px-8 py-6">Hello admin: {data?.name}</div>;
  };
  return <AdminLayout>{content()}</AdminLayout>;
};

export default AdminIndexPage;
