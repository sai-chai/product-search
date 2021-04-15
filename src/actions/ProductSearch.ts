import Product from 'src/models/Product';

// Stand-in for Redux interface
export interface PayloadAction {
   type: string;
   payload: any;
}

/* Constants */

export const CHANGE_FILTER = 'change_filter';

export const CHANGE_SORT_FIELD = 'change_sort_field';

export const TOGGLE_SORT_ORDER = 'toggle_sort_order';

export const UPDATE_PRODUCTS = 'update_products';

export const CANCEL_UPDATE = 'cancel_update';

/* Actions */

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
});

const cancelUpdate = (): PayloadAction => ({
   type: CANCEL_UPDATE,
   payload: null,
});

export default {
   changeFilter,
   changeSortField,
   toggleSortOrder,
   updateProducts,
   cancelUpdate,
};
