import Head from 'next/head';
import {
   useRef, useReducer, KeyboardEvent, MouseEvent,
} from 'react';
import useSWR from 'swr';
import styled from 'styled-components';
import reducer, { initialState } from 'src/reducers/ProductSearch';
import actions from 'src/actions/ProductSearch';
import { ProductsRequestBody, Product } from './api/products';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const fields = [
   ['id', 'ID'],
   ['name', 'Name'],
   ['abv', 'ABV'],
   ['vintage_year', 'Vintage'],
];

function ProductSearch() {
   const [ state, dispatch ] = useReducer(reducer, initialState);
   const filterField = useRef<HTMLInputElement>(null);

   const reqParams: ProductsRequestBody = {
      query: {},
      ascending: state.isAscending,
      sortBy: state.sortBy,
      filter: state.filter,
   };
   
   useSWR<Product[]>(
      state.shouldFetch ? `/api/products?q=${JSON.stringify(reqParams)}` : null,
      fetcher,
      {
         onSuccess: (newProducts) => 
            dispatch(actions.updateProducts(newProducts)),
         onError: () => dispatch(actions.cancelUpdate()),
         onLoadingSlow: () => dispatch(actions.cancelUpdate()),
      },
   );

   const handleFilterEntry = (event: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement>) => {
      if (
         'key' in event && event.key === 'Enter' ||
         event.target instanceof HTMLButtonElement && event.type === 'click'
      ) {
         dispatch(actions.changeFilter(filterField.current.value));
      }
   };

   const handleSwitchSortOrder = (event: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement>) => {
      if (state.shouldFetch) return;
      if (
         'key' in event && event.key === 'Enter' || 
         event.type === 'click'
      ) {
         dispatch(actions.toggleSortOrder());
      }
   };

   const handleChangeSortField = (event: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement>) => {
      if (state.shouldFetch) return;
      if (
         'key' in event && event.key === 'Enter' || 
         event.type === 'click'
      ) {
         if (event.target instanceof HTMLElement) {
            dispatch(actions.changeSortField(event.target.id));
         }
      }
   };

   const headerArrow = (field: string) => (
      state.sortBy === field && ( 
         state.isAscending ? <>&#x25B2;</> : <>&#x25BC;</> 
      ) || <>&#x25B6;&#xFE0E;</>
   );

   const headerHandlerFactory = (field: string) => (
      field !== state.sortBy ? handleChangeSortField : handleSwitchSortOrder
   );

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
                  id="filter"
                  name="filter"
                  ref={filterField}
                  disabled={state.shouldFetch}
                  onKeyPress={handleFilterEntry}
               />
               <button
                  type="button"
                  id="filterSubmit"
                  disabled={state.shouldFetch}
                  onClick={handleFilterEntry}
               >
                  Filter
               </button>
            </FilterWrapper>
            <TableWrapper data-active={state.shouldFetch} aria-busy={state.shouldFetch}>
               <thead>
                  <tr>
                     {fields.map((field) => (
                        <th
                           tabIndex={field[0] !== 'id' ? 0 : null}
                           role="button"
                           key={field[0]}
                           id={field[0]}
                           onClick={field[0] !== 'id' ? headerHandlerFactory(field[0]) : null}
                           onKeyPress={field[0] !== 'id' ? headerHandlerFactory(field[0]) : null}
                        >
                           {field[1]}
                           {` `}
                           {field[0] !== 'id' && headerArrow(field[0])}
                        </th>
                     ))}
                  </tr>
               </thead>
               {state.products.length ? (
                  <tbody>
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
      border-style: solid;
      border-radius: 10px;
   }
   input[type="text"] {
      width: 40vw;
      margin: calc((8vh - 2.6rem)/ 2) 0;
      padding: 0.6em;
   }
   button {
      margin: 0 1em;
      padding: 0.6em 1em;
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
      background-color: #d0d0d0;
      font-size: 1.1em;
      tr {
         border: solid #111;
         border-width: 0 0 2px 0;
      }
   }
   tbody {
      opacity: ${props => props['data-active'] ? 0.25 : 1}
   }
   tfoot tr {
      grid-template-columns: auto;
   }
   th {
      cursor: pointer;
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