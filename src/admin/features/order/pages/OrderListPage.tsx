import { Title } from "../../../shared/components/ui/Title";
import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb";
import { prefixAdmin } from "../../../shared/constants/routes";
import { OrderList } from "./sections/OrderList";
export const OrderListPage = () => {
    return (
        <>
            <div className="mb-[calc(5*var(--spacing))] gap-[calc(2*var(--spacing))] flex flex-col md:flex-row md:items-start md:justify-end">
                <div className="mr-auto">
                    <Title title="Danh sách đơn hàng" />
                    <Breadcrumb
                        items={[
                            { label: "Bảng điều khiển", to: `/${prefixAdmin}` },
                            { label: "Danh sách đơn hàng" }
                        ]}
                    />
                </div>
            </div>

            <OrderList />
        </>
    );
};

