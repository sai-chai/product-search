import { Product } from "src/pages/api/products";

export interface PayloadAction {
   type: string;
   payload: any;
}

export const CHANGE_FILTER = "change_filter";

export const CHANGE_SORT_FIELD = "change_sort_field";

export const TOGGLE_SORT_ORDER = "toggle_sort_order";

export const UPDATE_PRODUCTS = "update_products";

const changeFilter = (newFilter: string): PayloadAction => ({
   type: CHANGE_FILTER,
   payload: newFilter,
});

const changeSortField = (sortField: string): PayloadAction => ({
   type: CHANGE_SORT_FIELD,
   payload: sortField,
});

const toggleSortOrder = (): PayloadAction => ({
   type: TOGGLE_SORT_ORDER,
   payload: null,
});

const updateProducts = (products: Product[]): PayloadAction => ({
   type: UPDATE_PRODUCTS,
   payload: products,
})

export default {
   changeFilter,
   changeSortField,
   toggleSortOrder,
   updateProducts,
};
