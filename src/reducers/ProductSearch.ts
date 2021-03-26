import { Reducer } from 'react';
import {
   PayloadAction, CHANGE_FILTER, CHANGE_SORT_FIELD, TOGGLE_SORT_ORDER, UPDATE_PRODUCTS, CANCEL_UPDATE,
} from 'src/actions/ProductSearch';
import { Product } from 'src/pages/api/products';

export interface ProductSearchState {
   products: Product[];
   filter: string;
   sortBy: 'name' | 'id' | 'abv' | 'vintage_year';
   isAscending: boolean;
   isFetching: boolean;
}

export const initialState: ProductSearchState = {
   products: [],
   filter: '',
   sortBy: 'vintage_year',
   isAscending: true,
   isFetching: true, // triggers initial fetch
};

const ProductSearchReducer: Reducer<ProductSearchState, PayloadAction> = (state, action) => {
   switch (action.type) {
   case CHANGE_FILTER:
      return {
         ...state,
         filter: action.payload,
         isFetching: true,
      };
   case CHANGE_SORT_FIELD:
      return {
         ...state,
         sortBy: action.payload,
         isFetching: true,
      };
   case TOGGLE_SORT_ORDER:
      return {
         ...state,
         isAscending: !state.isAscending,
         isFetching: true,
      };
   case UPDATE_PRODUCTS:
      return {
         ...state,
         products: action.payload,
         isFetching: false,
      };
   case CANCEL_UPDATE:
      return {
         ...state,
         isFetching: false,
      };
   default:
      throw new Error(`${action.type} is not a valid action type`);
   }
};

export default ProductSearchReducer;
