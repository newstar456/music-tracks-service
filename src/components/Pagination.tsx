import { PaginationProps } from "@/types";


const Pagination = ({totalPages, currentPage, onPageChange}: PaginationProps) => {

  if (totalPages < 1) return null;

  return (
    <div className='flex flex-row justify-center items-center gap-2 mt-6'>
      {Array.from({length: totalPages}, (_, i) => (
        <button key={i}
                onClick={() => onPageChange(i + 1)}
                style={{
                  backgroundColor: currentPage === i + 1 ? "grey" : "lightgrey",
                  fontWeight: currentPage === i + 1 ? "bolder" : "regular",
                  color: "white",
                  padding: '4px 20px',
                  borderRadius: '4px',
                  cursor:'pointer'
                }}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )
}

export default Pagination;