{/* PAGINATION------ */}
<div className="flex items-center justify-between my-6">
<div>
  <Button
    // disabled={currentPage === 1}
    // onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    className="bg-white font-semibold border-2 p-2 text-sm"
  >
    Previous
  </Button>{" "}
</div>
<div>
  <p>
    {/* Page {currentPage} of{' '}
                      {Math.ceil(filteredData.length / itemsPerPage)} */}
    Page 1 of 10
  </p>
</div>
<div>
  <Button
    // disabled={
    //     currentPage >= Math.ceil(filteredData.length / itemsPerPage)
    // }
    // onClick={() => setCurrentPage((prev) => prev + 1)}
    className="bg-white font-semibold border-2 p-2 text-sm"
  >
    Next
  </Button>{" "}
</div>
</div>