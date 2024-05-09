import { useToast } from '@/components/ui/use-toast';
import { useAddMediaAsset } from '@/queries/media-assets.query';
import { SubmitHandler, useForm } from 'react-hook-form';

interface MediaAssetForm {
    mediaFileList: FileList
};

const MediaAssetUploadForm = (): JSX.Element => {
    const { register, handleSubmit } = useForm<MediaAssetForm>();
    const addMediaAsset = useAddMediaAsset();
    const { toast } = useToast();

    // TODO: laadsymbool terwijl-ie aan het uploaden is
    const uploadMediaAsset: SubmitHandler<MediaAssetForm> = ({ mediaFileList }) => {
        addMediaAsset.mutate(
            { mediaFile: mediaFileList[0] },
            {
                onSuccess: ({ filename }) => {
                    toast({
                        title: `Bestand ${filename} geüpload`,
                    });
                },
                onError: (err) => {
                    toast({
                        title: 'Kon bestand niet uploaden',
                        description: err.message,
                        variant: 'destructive'
                    });
                }
            }
        )
    };

    return (
        <form onSubmit={handleSubmit(uploadMediaAsset)}>
            <input type='file' {...register('mediaFileList', { required: true })} />
            <button type='submit'>
                Upload
            </button>
        </form>
    );
};

export default MediaAssetUploadForm;
