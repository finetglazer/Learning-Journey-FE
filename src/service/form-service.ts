import { convertArrErrToObjErr } from "@/lib/utils";
import { FieldError } from "@/model/field-error";
import { useCallback, useState } from "react";
import { Model } from "react-3layer-common";
import { finalize, Observable } from 'rxjs';
import { toast } from "sonner";

export const formService = {
    useForm<T extends Model>(
        modelClass: new () => T,
        onSubmit: (form?: Model) => Observable<any>,
        callbackFn?: () => void,
    ) {
        const [model, setModel] = useState<T>(new modelClass);
        const [loading, setLoading] = useState<boolean>(false);

        const updateModel = useCallback((fieldName: string, value: any) => {
            setModel({
                ...model,
                [fieldName]: value,
            });
        }, [modelClass, model]);

        const onSubmitForm = useCallback(() => {
            setLoading(true);
            onSubmit(model)
                .pipe(finalize(() => setLoading(false)))
                .subscribe({
                    next: res => {
                        if (res?.status) {
                            if (res?.data) {
                                setModel({
                                    ...model,
                                    ...res?.data,
                                    errors: undefined,
                                });
                            }
                            if (res?.message) {
                                toast.success(res?.message);
                            }
                            if (typeof callbackFn === "function") {
                                callbackFn();
                            }
                        }
                        else if (!res?.status) {
                            if (res?.data) {
                                updateModel("errors", convertArrErrToObjErr(res?.data as FieldError[]));
                            }
                            else if (res?.message) {
                                toast.error(res?.message);
                                updateModel("errors", undefined);
                            }
                        }
                    },
                    error: err => {
                        const res = err?.response?.data;
                        if (res?.data) {
                            updateModel("errors", convertArrErrToObjErr(res?.data as FieldError[]));
                        }
                        else if (res?.message) {
                            toast.error(res?.message);
                            updateModel("errors", undefined);
                        }
                    }
                });
        }, [onSubmit, model]);

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