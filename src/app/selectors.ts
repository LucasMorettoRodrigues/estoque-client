import { RootState } from "./store";

export const productsToAliquotSelector = (state: RootState) =>
    state.product.products.filter((product) => !!product.qty_to_child &&
        !!product.product_child_id && product.subproducts!.length > 0
    )

export const archivedProducts = (state: RootState) =>
    state.product.products.filter(i => i.hide === true)

export const inventoriesSelector = (state: RootState) =>
    state.notification.notifications.filter(i => i.description === 'Inventário')

export const scheduleSelector = (state: RootState) =>
    state.notification.notifications.filter(i => i.description === 'Agendamento de Inventário')