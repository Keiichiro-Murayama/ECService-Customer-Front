import { OrderHistoryDetail } from "@/components/api/purchase/history/OrderHistoryDetail";

type Props = {
    params: Promise<{
        orderUuid: string;
    }>;
};

export default async function OrderHistoryDetailPage({
    params,
}: Props) {
    const { orderUuid } = await params;

    console.log("取得したorderUuid:", orderUuid);

    return (
        <OrderHistoryDetail orderUuid={orderUuid} />
    );
}
