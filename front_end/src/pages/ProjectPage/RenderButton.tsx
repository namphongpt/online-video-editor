import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ProjectInterface } from '@/interfaces/project';
import { useRenderProject } from '@/queries/projects.query';
import { useCallback } from 'react';

interface RenderButtonProps {
    project: ProjectInterface;
};

const RenderButton = ({ project }: RenderButtonProps): JSX.Element => {
    const renderProject = useRenderProject();
    const handleRender = useCallback(() => {
        renderProject.mutate(
            { id: project.id },
            {
                onSuccess: () => {
                    toast({
                        title: 'Verwerken van project gestart',
                        description: 'Dit kan even duren. De pagina hoeft niet open te blijven.'
                    })
                },
                onError: (err) => {
                    toast({
                        title: 'Kon verwerken niet starten',
                        description: err.message,
                        variant: 'destructive'
                    });
                }
            }
        );
    }, []);

    return (
        <Button onClick={handleRender} disabled={renderProject.isPending}>
            Verwerken
        </Button>
    );
};

export default RenderButton;
