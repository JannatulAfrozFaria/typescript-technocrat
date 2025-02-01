<Table>
						<TableHeader>
							{columns.map((column) => (
								<TableRow key={column.id}>
									<TableHead>{flexRender(column.header, {})}</TableHead>
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow key={row.id}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className='h-24 text-center'
									>
										No results, please redefine your search input
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>