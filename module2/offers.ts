<div className="">
                  {data?.length > 0 ? (
                    <div>
                      <OfferDataTable columns={offerColumns} data={data} />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 justify-center items-center p-24 ">
                      <p className="text-lg font-semibold">
                        No invoices and sales
                      </p>
                      <Button className="bg-white border-2 border-[#e2e8f0] rounded-md text-[#4e5b6c] font-medium text-sm p-4">
                        + Create invoice
                      </Button>
                    </div>
                  )}
                </div>