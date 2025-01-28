<div className={ `grid gap-4 items-center xl:hidden p-4 
    ${activeTab === "invoices" ? "grid-cols-2" : "grid-cols-1"} 
   `}>
   <div className="relative">
     <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400">
       <SearchIcon />
     </span>
     <Input
       className="pl-10 h-[40px] bg-white text-[#64748b] w-[320px] xl:w-full rounded-md border border-gray-300 focus:border-[#4880FF] focus:outline-none text-base"
       placeholder="Search"
       // value={searchInput}
       // onChange={handleSearch}
     />
   </div>
   {/* Conditionally Render Select */}
   {activeTab === "invoices" && (
     <Select>
       <SelectTrigger className="w-[180px]">
         <SelectValue placeholder="Current month" />
       </SelectTrigger>
       <SelectContent>
         <SelectItem
           className="hover:bg-[#d1dbfa]"
           value="currentMonth"
         >
           Current month
         </SelectItem>
         <SelectItem
           className="hover:bg-[#d1dbfa]"
           value="previousMonth"
         >
           Previous month
         </SelectItem>
         <SelectItem className="hover:bg-[#d1dbfa]" value="30">
           Last 30 days
         </SelectItem>
         <SelectItem
           className="hover:bg-[#d1dbfa]"
           value="previousQuarter"
         >
           Previous quarter
         </SelectItem>
         <SelectItem className="hover:bg-[#d1dbfa]" value="90">
           Last 90 days
         </SelectItem>
         <SelectItem
           className="hover:bg-[#d1dbfa]"
           value="currentYear"
         >
           Current year
         </SelectItem>
         <SelectItem
           className="hover:bg-[#d1dbfa]"
           value="previousYear"
         >
           Previous year
         </SelectItem>
         <SelectItem className="hover:bg-[#d1dbfa]" value="365">
           Last 365 days
         </SelectItem>
       </SelectContent>
     </Select>
   )}
 </div>