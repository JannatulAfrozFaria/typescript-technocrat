"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Contact } from "@prisma/client";
import { CellContext } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import EmailIcon from "@/components/icon-components/EmailIcon";
import PhoneIcon from "@/components/icon-components/PhoneIcon";
import WebIcon from "@/components/icon-components/WebIcon";
import ThreeDotIcon from "@/components/icon-components/ThreeDotIcon";
import EditIcon from "@/components/icon-components/EditIcon";
import EditGrayIcon from "@/components/icon-components/EditGrayIcon";
import { Input } from "@/components/ui/input";
import Nicolas from "@/components/icon-components/Nicolas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddNoteIcon from "@/components/icon-components/AddNoteIcon";
import { Button } from "@/components/ui/button";
import SearchIcon from "@/components/icon-components/SearchIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditModal from "@/components/contactModal/EditModal";

type ContactPerson = {
  id: number;
  icon: React.ComponentType;
  name: string;
};

const contactPeople: ContactPerson[] = [
  { id: 1, icon: Nicolas, name: "Jennifer Lawrence" },
  { id: 2, icon: Nicolas, name: "Nicolas Ilies" },
  { id: 3, icon: Nicolas, name: "Emma Watson" },
  { id: 4, icon: Nicolas, name: "Chris Hemsworth" },
  { id: 5, icon: Nicolas, name: "Scarlett Johansson" },
  { id: 6, icon: Nicolas, name: "Tom Hiddleston" },
  { id: 7, icon: Nicolas, name: "Robert Downey Jr." },
  { id: 8, icon: Nicolas, name: "Elizabeth Olsen" },
];

export const columns: any = [
  {
    id: 1,
    accessorKey: "name",
    header: "Name",
    cell: ({ row }: CellContext<Contact, string>) => {
      const [isSheetOpen, setIsSheetOpen] = useState(false);
      const [contactNo, setContactNo] = useState("");
      const [searchInput, setSearchInput] = useState<string>("");
      const [filteredContacts, setFilteredContacts] = useState<ContactPerson[]>(
        contactPeople.slice(0, 2)
      );

      const [lastSearch, setLastSearch] = useState<string>(""); 

      const handleSheetToggle = () => {
        setIsSheetOpen((prev) => !prev);
      };

      const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          const filtered = contactPeople
            .filter((person) =>
              person.name.toLowerCase().includes(searchInput.toLowerCase())
            )
            .slice(0, 2);
          setFilteredContacts(filtered);
          setLastSearch(searchInput);
        }
      };

       const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchInput(e.target.value);
            };
            
            useEffect(() => {
              const debounceTimer = setTimeout(() => {
                if (searchInput.trim()) {
                  const filtered = contactPeople
                    .filter((person) =>
                      person.name.toLowerCase().includes(searchInput.toLowerCase())
                    )
                    .slice(0, 2);
                  setFilteredContacts(filtered);
                  setLastSearch(searchInput);
                } else {
                  // Reset to default view when input is cleared
                  setFilteredContacts(contactPeople.slice(0, 2));
                  setLastSearch("");
                }
              }, 500); // Adjust debounce delay (500ms in this case)
            
              return () => clearTimeout(debounceTimer); // Cleanup on every change
            }, [searchInput]);

      //
      const [isDropdownOpen, setIsDropdownOpen] = useState(false);
      const [isSheetVisible, setIsSheetVisible] = useState(true);

      const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
      const closeDropdown = () => {
        setIsDropdownOpen(false);
      };

      const closeSheet = () => setIsSheetVisible(false);

      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const closeDialog = () => {
        setIsDialogOpen(false);
      };
      const contactT = row.original.contactType;
      return (
        <div>
          <button
            onClick={handleSheetToggle}
            className="text-[#323949] hover:text-blue-600 hover:underline"
          >
            {row.original.name}
          </button>

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild></SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center ">
                        <h1 className="text-3xl font-semibold">
                          {" "}
                          {row.original.name}{" "}
                        </h1>
                        <span
                          className={`text-xs rounded-full text-white p-1 text-center ${
                            row.original.contactType === "Vendor"
                              ? "bg-[#7a5af8]"
                              : row.original.contactType === "Customer"
                              ? "bg-[#2354e6]"
                              : row.original.contactType === "Customer/Vendor"
                              ? "bg-[#16b364]"
                              : "bg-[#2354e6]"
                          }`}
                        >
                          {row.original.contactType}
                        </span>
                      </div>
                      {/* THREE------DOT----- */}
                      <div className="cursor-pointer" onClick={toggleDropdown}>
                        <ThreeDotIcon />
                        {isDropdownOpen && (
                          <div className="absolute top-14 right-4 w-32 bg-white border border-gray-200 rounded-md shadow-lg">
                            <button className="block w-full px-4 py-2 text-left text-sm hover:bg-[#d1dbfa]">
                              Edit
                            </button>
                            <div
                              className="block w-full px-4 py-2 text-left text-sm hover:bg-[#d1dbfa]"
                              onClick={() => setIsDialogOpen(true)}
                            >
                              Delete
                            </div>
                            <button
                              className="block w-full px-4 py-2 text-left text-sm hover:bg-[#d1dbfa]"
                              onClick={() => {
                                closeSheet();
                                setIsSheetOpen(false);
                              }}
                            >
                              Close
                            </button>
                          </div>
                        )}
                      </div>
                      {isDialogOpen && (
                        <div
                          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 "
                          onClick={closeDialog} 
                        >
                          <div
                            className="bg-white w-[300px] p-6 rounded-lg shadow-lg relative"
                            onClick={(e) => e.stopPropagation()} 
                          >
                            {/* Close ------------Button */}
                            <button
                              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                              onClick={closeDialog}
                            >
                              {/* &times; */}
                            </button>
                            <h1 className="font-semibold text-lg mt-3 mb-6 text-center">
                              Are you sure?
                            </h1>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                className="bg-[#ff3b30] text-white w-full rounded-md font-semibold "
                                onClick={() => {
                                  alert("Item deleted!");
                                  closeDialog();
                                  closeDropdown();
                                }}
                              >
                                Delete
                              </Button>
                              <Button
                                className="bg-[#ffffff] text-[#475569] border-2 border-[#e2e8f0] w-full rounded-md font-semibold "
                                onClick={closeDialog}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-[#334155] font-medium mt-2 mb-4">
                      NIF: {row.original.nif}{" "}
                    </p>
                    <div className="flex gap-8 items-center justify-start mb-4">
                      <div className="cursor-pointer">
                        <EmailIcon />
                      </div>
                      <div className="cursor-pointer">
                        <PhoneIcon />
                      </div>
                      <div className="cursor-pointer">
                        <WebIcon />
                      </div>
                    </div>
                  </div>
                </SheetTitle>
              </SheetHeader>
              {/* CONTACT INFO---- */}
              <div className="flex justify-between items-center my-4">
                <div>
                  <h1 className="text-lg font-semibold">Contact Information</h1>
                </div>
                <div
                  className="text-[#2354e6] flex gap-2 items-center "
                >
                  <EditIcon />
                  <button className="font-semibold">Edit</button>
                </div>
              </div>
              <div className="p-4 text-[#334155]  bg-[#f8fafc] rounded-2xl  ">
                <div className="flex gap-4 justify-between  w-full">
                  <p>Email</p>
                  <p className="text-right text-black">
                    {" "}
                    {row.original.email}{" "}
                  </p>
                </div>
                <div className="flex justify-between  w-full">
                  <p>Phone</p>
                  <p className="text-right text-black">
                    {" "}
                    {row.original.phone}{" "}
                  </p>
                </div>
                <div className="flex justify-between  w-full">
                  <p>Address</p>
                  <p className="text-right text-black">
                    {" "}
                    {row.original.address}{" "}
                  </p>
                </div>
                <div className="flex justify-between  w-full">
                  <p>Website</p>
                  <p className="text-right text-black">
                    {" "}
                    {row.original.website}{" "}
                  </p>
                </div>
              </div>
              {/* CREATE ----NEW---- */}
              <div>
                <h1 className="text-lg font-semibold mt-8 mb-4">Create new</h1>
                <div className="grid grid-cols-3 gap-2 items-center text-[#334155] text-lg font-semibold">
                  <div className="py-2  border-2 rounded-xl border-[#e2e8f0] flex gap-2 items-center justify-center cursor-pointer ">
                    {" "}
                    <EditGrayIcon />
                    <span>Offer</span>
                  </div>
                  <div className="py-2  border-2 rounded-xl border-[#e2e8f0] flex gap-2 items-center justify-center cursor-pointer">
                    {" "}
                    <EditGrayIcon />
                    <span>Invoice</span>
                  </div>
                  {/* ADD---NOTE---- */}
                  <div>
                    <Dialog>
                      <DialogTrigger className="flex gap-2 items-center justify-center py-2  border-2 rounded-xl border-[#e2e8f0] w-full">
                        <EditGrayIcon /> <span>Note</span>
                      </DialogTrigger>
                      <DialogContent style={{ width: "600px" }}>
                        <DialogHeader>
                          <DialogTitle>
                            <div className="grid grid-cols-1 justify-center text-center">
                              <div className="flex justify-center mt-4">
                                <AddNoteIcon />
                              </div>
                              <h1 className="font-semibold text-3xl mt-3 mb-6">
                                Add note
                              </h1>
                            </div>
                          </DialogTitle>
                          <DialogDescription>
                            <h2 className="text-sm font-medium text-black mb-2">
                              Description
                            </h2>
                            <textarea className="w-full h-48 mb-6 bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-xl "></textarea>
                            <Button className="bg-[#2354e6] text-white w-full rounded-md font-semibold ">
                              Save & Close
                            </Button>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
              {/* CONTACT PEOPLE---- */}
              <div className="my-8 border-2 border-[#e2e8f0] rounded-xl p-4 grid grid-cols-1 gap-2">
                <h1 className="text-lg font-semibold">Contact People</h1>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400">
                    <SearchIcon />
                  </span>
                  <Input
                    className="pl-10 h-[40px] bg-white text-[#64748b] w-[320px] xl:w-full rounded-md border border-gray-300 focus:border-[#4880FF] focus:outline-none text-base contactSearch"
                    placeholder="Search"
                    value={searchInput}
                    onChange={handleInputChange}
                    onKeyDown={handleSearch}
                  />
                </div>
                <div className="space-y-2 text-sm">
                  {filteredContacts.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-2 items-center bg-[#f8fafc] rounded-xl p-2 contactList"
                    >
                      <item.icon />
                      <p>{item.name}</p>
                    </div>
                  ))}
                  <button className="text-[#2354e6] bg-[#e8edfc] rounded-xl p-2 w-full text-left font-medium">
                    <Dialog>
                      <DialogTrigger className="addNewContact">
                        + Add new contact : "{lastSearch && `${lastSearch}`}"
                        {/* Display last search */}
                      </DialogTrigger>
                      <DialogContent style={{ width: "600px" }}>
                        <DialogHeader>
                          <DialogTitle>
                            <h1 className="font-semibold text-3xl  mb-6">
                              Create contact person
                            </h1>
                          </DialogTitle>
                          <DialogDescription>
                            <h2 className="text-sm font-medium text-black mb-2">
                              First Name
                            </h2>
                            <Input
                              bgColor="#f8fafc"
                              borderColor="#e2e8f0"
                              className="bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-2xl text-[#64748b] w-full py-2 px-4"
                              placeholder="First name"
                            />
                            <h2 className="text-sm font-medium text-black my-2">
                              Last Name
                            </h2>
                            <Input
                              bgColor="#f8fafc"
                              borderColor="#e2e8f0"
                              className="bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-2xl text-[#64748b] w-full py-2 px-4"
                              placeholder="Last name"
                            />
                            <h2 className="text-sm font-medium text-black my-2">
                              Email
                            </h2>
                            <Input
                              bgColor="#f8fafc"
                              borderColor="#e2e8f0"
                              className="bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-2xl text-[#64748b] w-full py-2 px-4"
                              placeholder="Email"
                            />
                            <h2 className="text-sm font-medium text-black my-2">
                              Phone
                            </h2>
                            <Input
                              bgColor="#f8fafc"
                              borderColor="#e2e8f0"
                              className="bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-2xl text-[#64748b] w-full py-2 px-4"
                              placeholder="Phone"
                            />
                            <Button className="bg-[#2354e6] text-white w-full rounded-md font-semibold mt-6">
                              Create contact person
                            </Button>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </button>
                </div>
              </div>
              {/* TOTAL---REVENUE----EXPENSES---- */}
              <div className="flex justify-between">
                <div>
                  <h1 className="text-lg font-semibold ">Total revenue</h1>
                  <p className="text-[#0f172a] mt-4 mb-2">
                    {" "}
                    <span className="text-[#334155] text-sm  font-medium">
                      Sales:
                    </span>{" "}
                    $0.00
                  </p>
                  <p className="text-[#64748b] text-sm font-medium">
                    0 invoices
                  </p>
                </div>
                <div className="text-right">
                  <h1 className="text-lg font-semibold ">Total expenses</h1>
                  <p className="text-[#0f172a] mt-4 mb-2">
                    {" "}
                    <span className="text-[#334155] text-sm font-medium ">
                      Purchases:
                    </span>{" "}
                    $0.00
                  </p>
                  <p className="text-[#64748b] text-sm font-medium">
                    0 invoices
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      );
    },
  },
  { id: 2, accessorKey: "contactType", header: "Contact Type" },
  { id: 3, accessorKey: "entity", header: "Entity Type" },
  {
    id: 4,
    accessorKey: "email",
    header: "Contact Information",
    cell: ({ row }: CellContext<Contact, string>) => (
      <div>
        <p className="cursor-pointer"> {row.original.email}</p>
        <p className="cursor-pointer"> {row.original.phone}</p>
      </div>
    ),
  },
  {
    id: 5,
    accessorKey: "_id",
    header: () => (
      <div className="bg-[#e8edfc] rounded-tl-3xl py-2 px-4">Customer ID</div>
    ),
    cell: ({ getValue }: CellContext<Contact, string>) => (
      <span>{getValue() ?? "0000"}</span>
    ),
  },
  {
    id: 6,
    accessorKey: "balance",
    header: () => <div className="bg-[#e8edfc] py-2 px-4">Balance</div>,
    cell: ({ getValue }: CellContext<Contact, number>) => (
      <span>{getValue() ?? 0}</span>
    ),
  },
  {
    id: 7,
    accessorKey: "vendorId",
    header: () => <div className="bg-[#f4f3ff] py-2 px-4">Vendor ID</div>,
    cell: ({ getValue }: CellContext<Contact, number>) => (
      <span>{getValue() ?? 0}</span>
    ),
  },
  {
    id: 8,
    accessorKey: "balanceVendor",
    header: () => (
      <div className="bg-[#f4f3ff] rounded-tr-3xl py-2 px-4">Balance</div>
    ),
    cell: ({ getValue }: CellContext<Contact, number>) => (
      <span>{getValue() ?? 0}</span>
    ),
  },
];
