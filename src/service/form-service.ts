import { useCallback, useState } from "react";
import { Model } from "react-3layer-common";
import { finalize, Observable } from 'rxjs';
import { toast } from "sonner";

export const formService = {
    useForm(
        modelClass: Model,
        onSubmit: (form?: Model) => Observable<any>
    ) {
        const [model, setModel] = useState<Model>(modelClass);
        const [loading, setLoading] = useState<boolean>(false);

        const updateModel = useCallback((fieldName: string, value: any) => {
            setModel({
                ...model,
                [fieldName]: value,
            });
        }, [modelClass]);

        const onSubmitForm = useCallback((form?: Model) => {
            setLoading(true);
            onSubmit(form)
                .pipe(finalize(() => setLoading(false)))
                .subscribe({
                    next: res => {
                        console.log(111)
                        setModel({
                            ...model,
                            ...res?.data,
                        });
                        if (res?.message) {
                            console.log(111111111);
                            toast.success(res?.message);
                        }
                    },
                    error: err => {
                        console.log(err)
                        if (err?.data) {
                            updateModel("errors", err?.data);
                        }
                        else if (err?.message) {
                            toast.error(err?.message);
                        }
                    }
                });
        }, [onSubmit]);

        return {
            model,
            loading,
            setLoading,
            updateModel,
            setModel,
            onSubmitForm,
        }
    }
};