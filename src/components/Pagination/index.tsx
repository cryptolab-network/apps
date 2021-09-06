import { ReactComponent as ArrowIcon } from '../../assets/images/dropdown.svg';
import styled from 'styled-components';
import { useMemo } from 'react';

const MAX_SHOW_PAGE = 5;

interface IPageNumber {
  pageNum: number;
  currentPage: number;
  gotoPage: Function;
}
const Page: React.FC<IPageNumber> = ({ pageNum, currentPage, gotoPage }) => {
  return (
    <PageNum
      isCurrentPage={pageNum === currentPage ? true : false}
      onClick={() => {
        if (pageNum !== currentPage) {
          gotoPage();
        }
      }}
    >
      {pageNum}
    </PageNum>
  );
};

const Pagination = ({
  canPreviousPage = true,
  canNextPage = true,
  pageOptions,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  currentPage,
}) => {
  const pageNumDOM = useMemo(() => {
    let dom: React.ReactChild[] = [];
    // page count is smaller/equal than MAX_SHOW_PAGE
    if (pageCount <= MAX_SHOW_PAGE) {
      pageOptions.forEach((page) => {
        dom.push(
          <Page
            pageNum={page + 1}
            currentPage={currentPage + 1}
            gotoPage={() => {
              gotoPage(page);
            }}
          />
        );
      });
    } else {
      // page count is bigger than MAX_SHOW_PAGE
      if (currentPage - Math.floor(MAX_SHOW_PAGE / 2) <= 0) {
        for (let idx = 0; idx < MAX_SHOW_PAGE; idx++) {
          dom.push(
            <Page
              pageNum={pageOptions[idx] + 1}
              currentPage={currentPage + 1}
              gotoPage={() => {
                gotoPage(pageOptions[idx]);
              }}
            />
          );
        }
        dom.push(<Dot>...</Dot>);
      } else if (currentPage + Math.floor(MAX_SHOW_PAGE / 2) >= pageOptions.length - 1) {
        dom.push(<Dot>...</Dot>);
        for (let idx = pageOptions.length - MAX_SHOW_PAGE; idx <= pageOptions.length - 1; idx++) {
          dom.push(
            <Page
              pageNum={pageOptions[idx] + 1}
              currentPage={currentPage + 1}
              gotoPage={() => {
                gotoPage(pageOptions[idx]);
              }}
            />
          );
        }
      } else {
        dom.push(<Dot>...</Dot>);
        for (let idx = currentPage - 2; idx <= currentPage + 2; idx++) {
          dom.push(
            <Page
              pageNum={pageOptions[idx] + 1}
              currentPage={currentPage + 1}
              gotoPage={() => {
                gotoPage(pageOptions[idx]);
              }}
            />
          );
        }
        dom.push(<Dot>...</Dot>);
      }
    }

    return dom;
  }, [pageOptions, pageCount, gotoPage, currentPage]);

  return (
    <MainLayout>
      <ToPageButton
        style={{ marginRight: 9 }}
        disabled={!canPreviousPage}
        onClick={() => {
          gotoPage(0);
        }}
      >
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
      <ToPageButton
        style={{ marginRight: 9 }}
        disabled={!canPreviousPage}
        onClick={() => {
          previousPage();
        }}
      >
        <ArrowIcon
          style={{
            stroke: '#2f3842',
            transform: 'rotate(180deg)',
          }}
        />
      </ToPageButton>
      <Pages>{pageNumDOM}</Pages>
      <ToPageButton
        style={{ marginLeft: 9 }}
        disabled={!canNextPage}
        onClick={() => {
          nextPage();
        }}
      >
        <ArrowIcon
          style={{
            stroke: '#2f3842',
            transform: 'rotate(0deg)',
          }}
        />
      </ToPageButton>
      <ToPageButton
        style={{ marginLeft: 9 }}
        disabled={!canNextPage}
        onClick={() => {
          gotoPage(pageCount - 1);
        }}
      >
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
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

interface IPageNum {
  isCurrentPage: boolean;
}

const PageNum = styled.div<IPageNum>`
  color: ${(props) => (props.isCurrentPage ? 'white' : '#1ea9a5')};
  font-size: 12px;
  margin: 0 6px 0 6px;
  cursor: ${(props) => (props.isCurrentPage ? 'default' : 'pointer')};
`;

const Dot = styled.div`
  color: #1ea9a5;
  font-size: 12px;
`;
