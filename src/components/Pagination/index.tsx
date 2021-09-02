import { ReactComponent as ArrowIcon } from '../../assets/images/dropdown.svg';
import styled from 'styled-components';
import { useMemo } from 'react';

const Pagination = ({
  canPreviousPage = true,
  canNextPage = true,
  pageOptions,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
}) => {
  const pageNumDOM = useMemo(() => {
    console.log('attribute :', {
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
    });
    return null;
  }, [canPreviousPage, canNextPage, pageOptions, pageCount, gotoPage, nextPage, previousPage]);

  return (
    <MainLayout>
      <ToPageButton style={{ marginRight: 9 }} disabled={!canPreviousPage} onClick={() => {gotoPage(0)}}>
        <ArrowIcon
          style={{
            stroke: '#2f3842',
            transform: 'rotate(180deg)',
          }}
        />
        <ArrowIcon
          style={{
            stroke: '#2f3842',
            transform: 'rotate(180deg)',
          }}
        />
      </ToPageButton>
      <ToPageButton style={{ marginRight: 9 }} disabled={!canPreviousPage} onClick={() => {previousPage()}}>
        <ArrowIcon
          style={{
            stroke: '#2f3842',
            transform: 'rotate(180deg)',
          }}
        />
      </ToPageButton>
      <Pages>{pageNumDOM}</Pages>
      <ToPageButton style={{ marginLeft: 9 }} disabled={!canNextPage} onClick={() => {nextPage()}}>
        <ArrowIcon
          style={{
            stroke: '#2f3842',
            transform: 'rotate(0deg)',
          }}
        />
      </ToPageButton>
      <ToPageButton style={{ marginLeft: 9 }} disabled={!canNextPage} onClick={() => {gotoPage(pageCount - 1)}}>
        <ArrowIcon
          style={{
            stroke: '#2f3842',
            transform: 'rotate(0deg)',
          }}
        />
        <ArrowIcon
          style={{
            stroke: '#2f3842',
            transform: 'rotate(0deg)',
          }}
        />
      </ToPageButton>
    </MainLayout>
  );
};

export default Pagination;

const MainLayout = styled.div`
  height: 32px;
  width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface IPage {
  disabled?: boolean;
}

const ToPageButton = styled.div<IPage>`
  width: 19px;
  height: 19px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (!props.disabled ? '#1ea9a5' : '#4b5352')};
  border-radius: 2px;
  &:hover {
    background-color: white;
  }
`;

const Pages = styled.div`
  max-width: 250px;
`;
