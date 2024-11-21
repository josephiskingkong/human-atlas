import PanelNavigateButton from "../../components/Common/PanelNavigateButton";

import sections from '../../assets/images/sections.svg'
import user from '../../assets/images/user.svg'
import test from '../../assets/images/test.svg'
import AdminPageLayout from "./AdminPageLayout";

export default function AdminMenu() {
  return (
    <AdminPageLayout title="Управление сайтом">
            <PanelNavigateButton title="Слайды и разделы" icon={sections} path="/admin/categories/"/>
            <PanelNavigateButton title="Пользователи (в разработке)" icon={user} path="/admin/in-dev/"/>
            <PanelNavigateButton title="Тестирование (в разработке)" icon={test} path="/admin/in-dev/"/>
    </AdminPageLayout>
  );
}
