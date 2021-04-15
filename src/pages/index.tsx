import Head from 'next/head';
import {
   useRef, useReducer, KeyboardEvent, MouseEvent, AriaAttributes,
} from 'react';
import useSWR from 'swr';
import styled from 'styled-components';
import reducer, { initialState } from 'src/reducers/ProductSearch';
import actions from 'src/actions/ProductSearch';
import Product, { ProductsRequestBody } from 'src/models/Product';

// Required for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const fields = [
   ['id', 'ID'],
   ['name', 'Name'],
   ['abv', 'ABV'],
   ['vintage_year', 'Vintage'],
];

function ProductSearch() {
   
   /* Hooks */

   const [ state, dispatch ] = useReducer(reducer, initialState);
   const filterInputRef = useRef<HTMLInputElement>(null);

   const reqParams: ProductsRequestBody = {
      query: {},
      isAscending: state.isAscending,
      sortBy: state.sortBy,
      filter: state.filter,
   };
   
   /* Data fetching */

   // SWR automatically caches and dedupes. 
   useSWR<Product[]>(
      state.isFetching ? `/api/products?q=${JSON.stringify(reqParams)}` : null,
      fetcher,
      {
         onSuccess: (newProducts) => 
            dispatch(actions.updateProducts(newProducts)),
         onError: () => dispatch(actions.cancelUpdate()),
         onLoadingSlow: () => dispatch(actions.cancelUpdate()),
         revalidateOnFocus: false,
      },
   );
   
   /* UI event handlers */

   const handleFilterSubmit = (event: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement>) => {
      if (
         'key' in event && event.key === 'Enter' ||
         event.target instanceof HTMLButtonElement && event.type === 'click'
      ) {
         dispatch(actions.changeFilter(filterInputRef.current.value));
      }
   };

   const handleSwitchSortOrder = (event: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement>) => {
      if (state.isFetching) return;
      if (
         'key' in event && event.key === 'Enter' || 
         event.type === 'click'
      ) {
         dispatch(actions.toggleSortOrder());
      }
   };

   const handleChangeSortField = (event: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement>) => {
      if (state.isFetching) return;
      if (
         'key' in event && event.key === 'Enter' || 
         event.type === 'click'
      ) {
         if (event.target instanceof HTMLElement) {
            dispatch(actions.changeSortField(event.target.id));
         }
      }
   };

   /* Conditional rendering functions */

   // Returns tuple for DRYness
   const getSortIndicator = (field: string): [ JSX.Element, AriaAttributes['aria-sort'] ] => {
      if (state.sortBy === field) {
         if (state.isAscending) {
            return [ <>&#x25B2;</>, 'ascending' ]; // Up triangle
         }
         return [ <>&#x25BC;</>, 'descending' ];   // Down triangle
      }
      return [ <>&#x25B6;&#xFE0E;</>, 'none' ];    // Right triangle
   };

   /** 
    * Dedupes sort field changes and prevents sort order 
    * from changing at the same time as sort field.
    */
   const headerHandlerFactory = (field: string) => {
      if (field !== state.sortBy) {
         return handleChangeSortField;
      }
      return handleSwitchSortOrder;
   };

   return (
      <PageWrapper>
         <Head>
            <title>FortyFive - Product Search</title>
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <PageHeader>
            <img src="/wine-svgrepo-com.svg" alt="FortyFive logo" />
            <h1>FortyFive Product Quicksearch</h1>
         </PageHeader>
         <main>
            <FilterWrapper>
               <input
                  type="text"
                  id="filterInput"
                  name="filter"
                  placeholder="Filter"
                  aria-controls="mainTable"
                  ref={filterInputRef}
                  disabled={state.isFetching}
                  onKeyPress={handleFilterSubmit}
               />
               <button
                  type="button"
                  id="filterSubmit"
                  disabled={state.isFetching}
                  onClick={handleFilterSubmit}
               >
                  Enter
               </button>
            </FilterWrapper>
            <TableWrapper aria-busy={state.isFetching} id="mainTable">
               <thead>
                  <tr>
                     {fields.map(([ field, label ]) => (
                        field !== 'id' ? (
                           <th
                              tabIndex={0}
                              role={'button'}
                              aria-controls={'mainTable' || undefined}
                              aria-current={field === state.sortBy}
                              aria-sort={getSortIndicator( field )[1]}
                              key={field}
                              id={field}
                              onClick={headerHandlerFactory(field)}
                              onKeyPress={headerHandlerFactory(field)}
                           >
                              {label}
                              {` `}
                              {getSortIndicator( field )[0]}
                           </th>
                        ) : (
                           <th
                              key={field}
                              id={field}
                           >
                              {label}
                           </th>
                        )
                     ))}
                  </tr>
               </thead>
               {state.products.length ? (
                  <tbody data-busy={state.isFetching}>
                     {state.products.map((product, ind) => (
                        <tr key={product.id} data-row-even={!!(ind % 2)}>
                           <td headers="id">{product.id}</td>
                           <td headers="name">{product.name}</td>
                           <td headers="abv">{product.abv}</td>
                           <td headers="vintage_year">{product.vintage_year}</td>
                        </tr>
                     ))}
                  </tbody>
               ) : (
                  <tfoot>
                     <tr>
                        <td>No products found.</td>
                     </tr>
                  </tfoot>
               )}
            </TableWrapper>
         </main>
      </PageWrapper>
   );
}

export default ProductSearch;

const PageWrapper = styled.div`
   margin: 0 10vw 5vw;
   header, 
   main {
      width: 100%;
   }
`;

const PageHeader = styled.header`
   height: 12vh;
   display: flex;
   img {
      height: 70%;
      margin: auto 2vw auto 2vw;
   }
   h1 {
      line-height: 12vh;
   }
`;

const FilterWrapper = styled.div.attrs({role: "form"})`
   height: 8vh;
   * {
      height: 2.6em;
      font-size: 1em;
   }
   input[type="text"] {
      width: 40vw;
      margin: calc((8vh - 2.6rem)/ 2) 0;
      padding: 0.6em;
   }
   button {
      margin: 0 1em;
      padding: 0.6em 1em;
      cursor: pointer;
      background-color: #e0e0e0;
      :link,
      :visited,
      :hover {
         background-color: #c0c0c0;
      }
   }
   input, button {
      border-style: solid;
      border-radius: 10px;
   }
`;

const TableWrapper = styled.table`
   width: 100%;
   border: solid #111;
   border-width: 2px;
   border-spacing: 0;
   tr {
      display: grid;
      grid-template-columns: 8vw auto 9vw 10vw;
      line-height: 2;
      &[data-row-even="true"] {
         background-color: #e8e8e8;
      }
   }
   thead {
      background-color: #e0e0e0;
      font-size: 1.1em;
      tr {
         border: solid #111;
         border-width: 0 0 2px 0;
      }
   }
   tbody {
      opacity: 1;
      &[data-busy="true"] {
         opacity: 0.25;
      }
   }
   tfoot tr {
      grid-template-columns: auto;
   }
   th:not(#id) {
      cursor: pointer;
      :link,
      :visited,
      :hover {
         background-color: #c0c0c0;
      }
   }
   td{
      overflow: scroll;
   }
   th,
   td {
      border: solid #777;
      border-width: 0 0.5px;
      border-spacing: 0;
      font-weight: normal;
      text-align: center;
      padding: 0 1vw;
      outline-offset: -4px;
      :first-child {
         border-left-width: 0;
      }
      :last-child {
         border-right-width: 0;
      }
      &[headers="name"], &#name {
         text-align: left;
      }
   }
`;
