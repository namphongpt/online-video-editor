import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAddProject } from "@/queries/projects.query";
import { CreateProjectParam } from "@/repositories/projects/projectRepository.param";
import { AlertCircle, PlusCircle } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const CreateProjectDialogButton = (): JSX.Element => {
    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm<CreateProjectParam>();
    const addProject = useAddProject();
    const navigate = useNavigate();
    const { toast } = useToast();

    const createProject: SubmitHandler<CreateProjectParam> = (data) => {
        addProject.mutate(
            data,
            {
                onSuccess: ({ id }) => { navigate(`/project/${id}`); },
                onError: (err) => {
                    toast({
                        title: 'Kon project niet aanmaken',
                        description: err.message,
                        variant: 'destructive'
                    })
                }
            }
        )
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Maak project aan
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nieuw project aanmaken</DialogTitle>
                    <DialogDescription>
                        Maak een nieuw project aan voor het bewerken van een
                        nieuwe video.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(createProject)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Titel
                            </Label>
                            <Input
                                id="title"
                                className="col-span-3"
                                {...register("title", { required: true })}
                            />
                        </div>
                        {errors.title?.type === "required" && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Fout</AlertTitle>
                                <AlertDescription>
                                  De titel is verplicht.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            id="create-project-submit"
                            type="submit"
                            disabled={addProject.isPending}
                        >
                            Maak aan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
};

export default CreateProjectDialogButton;
