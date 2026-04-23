import AddIcon from '@mui/icons-material/Add';
import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb";
import { ProductList } from "./sections/ProductList";
import { Title } from "../../../shared/components/ui/Title";
import { prefixAdmin } from "../../../shared/constants/routes";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "../../../shared/components/ui/LoadingButton";
import { useProducts } from "./hooks/useProducts";

export const ProductListPage = () => {
    const navigate = useNavigate();
    const productHook = useProducts();

    return (
        <>
            <div className="mb-[calc(5*var(--spacing))] gap-[calc(2*var(--spacing))] flex flex-col md:flex-row md:items-start md:justify-end">
                <div className="mr-auto">
                    <Title title={"Danh sách sản phẩm"} />
                    <Breadcrumb
                        items={[
                            { label: "Bảng điều khiển", to: "/" },
                            { label: "Danh sách sản phẩm", to: `/${prefixAdmin}/product/list` },
                            { label: "Danh sách" }
                        ]}
                    />
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <LoadingButton
                        onClick={() => navigate(`/${prefixAdmin}/product/create`)}
                        label={"Tạo mới sản phẩm"}
                        startIcon={<AddIcon />}
                        sx={{
                            minHeight: "2.25rem",
                            padding: "var(--shape-borderRadius-sm) calc(2 * var(--spacing))",
                        }}
                    />
                </div>
            </div>

            <ProductList
                productHook={productHook}
            />
        </>
    )
}
