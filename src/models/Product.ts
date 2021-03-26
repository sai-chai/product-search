export default interface Product {
   _id: string;
   id: number;
   name: string;
   abv: string;
   vintage_year: string;
}

/**
 * @interface ProductsRequestBody
 * @property query - RestDB query object
 * @property hints - RestDB query hints, used for aggregation and projection
 * @property filter - text search query
 * @property sortBy - field to sort by
 * @property ascending - sort order
 * @property page
 * @property pageSize
 * @property groupBy - field to group documents by value
 */
 export interface ProductsRequestBody {
   query: Object;
   hints?: Object;
   filter?: string;
   sortBy?: string;
   isAscending?: boolean;
   page?: number;
   pageSize?: number;
   groupBy?: string;
}
