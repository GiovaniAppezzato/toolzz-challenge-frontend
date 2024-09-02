import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as yup from "yup";
import { useTranslation } from 'react-i18next';
import { FaPencilAlt, FaCamera } from "react-icons/fa";
import PrivateLayout from "@/components/layouts/PrivateLayout";
import UserService from '@/services/api/user';
import ToastService from '@/services/toast';
import useAuth from '@/hooks/useAuth';
import { Card, Input, Label, Button, Alert, Spinner, Avatar } from "@/components";
import i18n from '@/locales/i18n';
import translationsYup from '@/locales/yupMessages';
import { fileToBase64 } from '@/utilities/utils';

interface ISubmitValues {
  name: string;
  email: string;
  password: string;
  photo?: string;
}

yup.setLocale(translationsYup);

const schema = yup.object().shape({
  password: yup.string()
    .nullable()
    .transform((value, originalValue) => originalValue.trim() == "" ? null : value)
    .min(6)
    .label(i18n.t("fields.password")),
  email: yup.string().email().required().label(i18n.t("fields.email")),
  name: yup.string().required().label(i18n.t("fields.name")),
});

export default function EditUserPage() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isMe, setIsMe] = useState(false);
  const [values, setValues] = useState<ISubmitValues>({
    name: '',
    email: '',
    password: '',
    photo: undefined,
  });

  const { t } = useTranslation();
  const titlePage = t("pages.editUser.title");
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchUser() {
      const { id } = router.query;
      
      if(id) {
        const { data } = (await UserService.getUser(id as string)).data;
        setIsMe(data.id == user?.id);

        setValues({
          name: data.name,
          email: data.email,
          password: '',
          photo: undefined,
        });
      }
      setLoading(false);
    }

    fetchUser();
  }, []);

  async function handleSubmit() {
    if(!isEditing) {
      setIsEditing(true);
      try {
        // Validate fields
        await schema.validate(values, { abortEarly: true });

        // Send request to edit user
        await UserService.update({ 
          ...values ,
          id: router.query.id as string,
          password: values.password || undefined,
        });

        ToastService.success(t("pages.editUser.userEdited"));
        router.push('/');
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          ToastService.error(`${error.params?.label}: ${error.message}`);
        }
      } finally {
        setIsEditing(false);
      } 
    }
  }

  async function onChangePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const file = event.target.files[0];
      const base64 = await fileToBase64(file);

      if(base64) {
        setValues({ ...values, photo: base64 });
      }
    }
  }
  
  return (
    <PrivateLayout title={titlePage}>
      <Card>
        <Card.Header>
          <div>
            <h3 className="font-medium mb-1">Editar usuário</h3>
            <span className="text-xs">Edite um usuário do sistema.</span>
          </div>
        </Card.Header>
        <Card.Body>
          {!loading ? (
            <>
              <div className="mb-8 mt-4">
                <div className="w-full flex flex-wrap justify-center items-start sm:pl-4 md:flex-nowrap">
                  <div className="relative w-max">
                    <Avatar src={values.photo} className="!w-24 !h-24 !text-xl" />
                    <label htmlFor='photo' className="button-icon button-primary button-icon-lg cursor-pointer rounded-full absolute -bottom-0.5 -right-0.5 shadow-none border-[3px] border-navbar">
                      <FaCamera size={12} />
                    </label>
                    <input 
                      type="file" 
                      className="hidden"
                      accept="image/*"
                      name="photo"
                      id="photo"
                      onChange={onChangePhoto}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap -mx-2">
                <div className={`w-full px-2 mb-4 ${isMe ? 'md:w-1/3' : 'md:w-1/2'}`}>
                  <Label className="px-1" htmlFor="name">{t("fields.name")} <span className='text-danger'>*</span></Label>

                  <Input 
                    name='name'
                    id='name'
                    type='text'
                    value={values.name}
                    onChange={(event) => setValues({ ...values, name: event.target.value })}
                  />
                </div>
                <div className={`w-full px-2 mb-4 ${isMe ? 'md:w-1/3' : 'md:w-1/2'}`}>
                  <Label className="px-1" htmlFor="name">{t("fields.email")} <span className='text-danger'>*</span></Label>
                  
                  <Input 
                    name='email'
                    id='email'
                    type='email'
                    value={values.email}
                    onChange={(event) => setValues({ ...values, email: event.target.value })}
                  />
                </div>
                {isMe && (
                  <div className={`w-full px-2 mb-4 md:w-1/3`}>
                    <Label className="px-1" htmlFor="password">{t("pages.editUser.changePassword")}</Label>
                    
                    <Input 
                      name='password'
                      id='password'
                      type='password'
                      value={values.password}
                      onChange={(event) => setValues({ ...values, password: event.target.value })}
                    />
                  </div>
                )}    
              </div>
              <div className="flex justify-end items-center gap-x-4 mt-4">
                <Button className='normal-case' size="sm" variant='primary' loading={isEditing} onClick={handleSubmit}>
                  {t("pages.editUser.save")}
                </Button>
              </div>
            </>
          ) : (
            <Alert className='w-full flex justify-center'>
              <Spinner className='h-5 w-5' />
            </Alert>
          )}
        </Card.Body>
      </Card>
    </PrivateLayout>
  )
}
