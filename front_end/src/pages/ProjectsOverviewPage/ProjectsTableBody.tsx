import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useGetProjectsQuery } from "@/queries/projects.query";
import { MoreHorizontal } from "lucide-react";
import { Suspense } from "react";
import { Link } from "react-router-dom";

const LoadedProjectsTableBody = (): JSX.Element => {
    const { data: projects } = useGetProjectsQuery();

    return (<TableBody>
    <Suspense fallback={<h1>lol</h1>}>
    {projects.map(project => (
      <TableRow key={project.id} >
        <TableCell className="font-medium">
            {project.title}
        </TableCell>
        <TableCell>
          <Badge variant="outline">Concept</Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell" title={project.createdOn.toUTCString()}>
          {/* TODO: Human date (tot maand terug), maar dan als je op hovert de gehele datum */}
          {
            new Intl.DateTimeFormat(
              'nl-NL',
              { day: 'numeric', month: 'long', year: 'numeric' }
            ).format(project.createdOn)
          }
        </TableCell>
        <TableCell>
            <Button asChild>
                <Link to={`/project/${project.id}`}>Bewerk</Link>
            </Button>
        </TableCell>
        <TableCell onClick={(e) => {e.preventDefault(); return false;}}>
          <Sheet>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-haspopup="true"
                  size="icon"
                  variant="ghost"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acties</DropdownMenuLabel>
                <DropdownMenuItem>
                  <SheetTrigger>Wijzig naam</SheetTrigger>
                </DropdownMenuItem>
                <DropdownMenuItem>Verwijder</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <SheetContent>
              <SheetHeader>
                <SheetTitle>Wijzig de titel van &lsquo;{project.title}&rsquo;</SheetTitle>
                {/*<SheetDescription></SheetDescription>*/}
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Titel
                  </Label>
                  <Input id="name" value={project.title} className="col-span-3" />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit">Wijzig</Button>
                </SheetClose>
                {/* https://ui.shadcn.com/docs/components/dialog */}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </TableCell>
      </TableRow>
    ))}
    </Suspense>
  </TableBody>)
};

const SkeletonProjectsTableBody = (): JSX.Element => (
    <TableBody>
        {[...Array(Math.floor(Math.random() * 3) + 2)].map((_, i) => (
            <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-6 w-30" /></TableCell>
                <TableCell><Skeleton className="h-4 w-8" /></TableCell>
            </TableRow>
        ))}
    </TableBody>
);

const ProjectsTableBody = (): JSX.Element => (
    <Suspense fallback={<SkeletonProjectsTableBody />}>
        <LoadedProjectsTableBody />
    </Suspense>
)

export default ProjectsTableBody
