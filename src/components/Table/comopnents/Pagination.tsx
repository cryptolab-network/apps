import styled from 'styled-components';
import { ReactComponent as PaginationPrevIcon } from '../../../assets/images/pagination-prev.svg';
import { ReactComponent as PaginationNextIcon } from '../../../assets/images/pagination-next.svg';
import { ReactComponent as PaginationFirstIcon } from '../../../assets/images/pagination-to-start.svg';
import { ReactComponent as PaginationLastIcon } from '../../../assets/images/pagination-to-end.svg';

const Pagination = ({
  gotoPage,
  previousPage,
  nextPage,
  canPreviousPage,
  canNextPage,
  pageCount,
  currentPage,
  firstItemIndex,
  lastItemIndex,
}) => {
  return (
    <PaginationLayout>
      <PaginationInfo>
        Page {currentPage + 1}/{pageCount}
      </PaginationInfo>
      <PaginationButton><PaginationFirstIcon onClick={() => gotoPage(0)} /></PaginationButton>
      <PaginationButton><PaginationPrevIcon onClick={() => previousPage()} /></PaginationButton>
      <PaginationButton><PaginationNextIcon onClick={() => nextPage()} /></PaginationButton>
      <PaginationButton><PaginationLastIcon onClick={() => gotoPage(pageCount - 1)}/></PaginationButton>
      <PaginationInfo>
        {firstItemIndex} - {lastItemIndex}
      </PaginationInfo>
    </PaginationLayout>
  );
};

export default Pagination;

const PaginationLayout = styled.div`
  flex: 1;
  width: 100%;
  height 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const PaginationInfo = styled.div`
  color: white;
  margin: 15.8px 37.1px 8.1px 15.4px;
`;

const PaginationButton = styled.div`
  margin: 15.8px 16.8px 9.4px 16.9px;
  object-fit: contain;
`;
