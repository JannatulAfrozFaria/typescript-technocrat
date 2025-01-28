<div className="">
                  {data?.length > 0 ? (
                    <div>
                      {/* CHARTS------- */}
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 px-4">
                        {firstSectionData.map((item) => (
                          <div
                            key={item.id}
                            className={`p-4 border-2  rounded-xl 
                        ${
                          item.title === "Total sales" &&
                          "border-[#d3f8df] hover:border-black bg-[#edfcf2]"
                        }
                        ${
                          item.title === "Overdue sales" &&
                          "border-[#ffcecb] hover:border-black bg-[#fff3f2]"
                        }
                        ${
                          item.title === "Outstanding" &&
                          "border-[#ebe9fe] hover:border-black bg-[#ecebf7]"
                        }
                        `}
                          >
                            <h1 className=" text-2xl xl:text-lg font-semibold">
                              {" "}
                              {item.title}{" "}
                            </h1>
                            <div className="flex justify-between items-center my-4">
                              <h2
                                className={`
                          font-semibold text-2xl
                        `}
                              >
                                ${item.amount}
                              </h2>
                              <div>{item.image} </div>
                            </div>
                            {item.subtitle ? (
                              <div className="flex items-center gap-1 text-xs ">
                                <div>
                                  {item.title === "Revenue" && <DownArrowRed />}
                                  {item.title === "Expenses" && (
                                    <DownArrowGreen />
                                  )}
                                  {item.title === "Results" && <UpArrowGreen />}
                                </div>{" "}
                                <div>
                                  <h2
                                    className={`${
                                      item.title === "Total sales"
                                        ? "text-[#16b364]"
                                        : item.title === "Overdue sales"
                                        ? "text-[#ff3b30]"
                                        : "text-[#7a5af8]"
                                    }`}
                                  >
                                    {item.subtitle}
                                  </h2>
                                </div>
                                <div>
                                  <span className="text-[#475569]">
                                    {item.subTitleText}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <h2 className="text-[#5a8dfa] underline font-medium">
                                {" "}
                                {/* <Link href={'/'}> {item.button} </Link>{' '} */}
                              </h2>
                            )}
                          </div>
                        ))}
                      </div>
                      <UserDataTable columns={columns} data={data} />
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