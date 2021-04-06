import View from './view.js';
import icons from 'url:../../img/icons.svg';
import { RES_PER_PAGE } from './../config.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = Number(btn.dataset.goto);
      handler(goToPage);
    });
  }

  _generateMarkUp() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const curPage = this._data.page;
    // Different Pagination Scenarios:
    // 1. you are on the first page and there are more than 10 results(thus more than 1 page) ->
    if (curPage === 1 && numPages > 1) {
      return `
        <button data-goto="${
          curPage + 1
        }"class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1} of ${numPages}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }
    // 2. there are less than 10 results, so no pagination needed at all
    if (numPages === 1) {
      return '';
    }

    // 3. you are on the last page, so you only need the go back button (if theres more than 1 page) <-
    if (curPage === numPages) {
      return `
        <button data-goto="${
          curPage - 1
        }"class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
      `;
    }

    // 4. you are somewhere in the middle, meaning there are lower and higher pages than current page <- ->
    if (curPage > 1 && curPage < numPages) {
      return `
        <button data-goto="${
          curPage - 1
        }"class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
        <button data-goto="${
          curPage + 1
        }"class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }
    // return `
    //   <button class="btn--inline pagination__btn--prev">
    //     <svg class="search__icon">
    //       <use href="${icons}#icon-arrow-left"></use>
    //     </svg>
    //     <span>Page 1</span>
    //   </button>
    //   <button class="btn--inline pagination__btn--next">
    //     <span>Page 3</span>
    //     <svg class="search__icon">
    //       <use href="${icons}#icon-arrow-right"></use>
    //     </svg>
    //   </button>
    // `;
  }
}

export default new PaginationView();
