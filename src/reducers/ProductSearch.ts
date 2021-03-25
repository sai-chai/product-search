import { Reducer } from 'react';
import { PayloadAction, CHANGE_FILTER, CHANGE_SORT_FIELD, TOGGLE_SORT_ORDER, UPDATE_PRODUCTS } from 'src/actions/ProductSearch';
import { Product } from 'src/pages/api/products';

export interface ProductSearchState {
   products: Product[];
   filter: string;
   sortBy: "name" | "id" | "abv" | "vintage_year";
   isAscending: boolean;
   shouldFetch: boolean;
}

export const initialState: ProductSearchState = {
   products: [],
   filter: "",
   sortBy: "vintage_year",
   isAscending: false,
   shouldFetch: true, // triggers initial fetch
};

const ProductSearchReducer: Reducer<ProductSearchState, PayloadAction> = (state, action) => {
   switch (action.type) {
      case CHANGE_FILTER:
         return {
            ...state,
            filter: action.payload,
            shouldFetch: true,
         }
      case CHANGE_SORT_FIELD:
         return {
            ...state,
            sortBy: action.payload,
            shouldFetch: true,
         }
      case TOGGLE_SORT_ORDER:
         return {
            ...state,
            isAscending: !state.isAscending,
            shouldFetch: true,
         }
      case UPDATE_PRODUCTS:
         return {
            ...state,
            products: action.payload,
            shouldFetch: false,
         }
      default:
         throw new Error(`${action.type} is not a valid action type`);
   }
};

export default ProductSearchReducer;
