import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as yup from "yup";
import { useTranslation } from 'react-i18next';
import PrivateLayout from "@/components/layouts/PrivateLayout";
import ToastService from '@/services/toast';
import UserService from '@/services/api/user';
import { Card, Input, Label, Button } from "@/components";
import i18n from '@/locales/i18n';
import translationsYup from '@/locales/yupMessages';

yup.setLocale(translationsYup);

const schema = yup.object().shape({
  password: yup.string().required().min(6).label(i18n.t("fields.password")),
  email: yup.string().email().required().label(i18n.t("fields.email")),
  name: yup.string().required().label(i18n.t("fields.name")),
});

export default function CreateUserPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    photo: '',
  });

  const { t } = useTranslation();
  const titlePage = t("pages.createUser.title");
  const router = useRouter();

  async function handleSubmit() {
    if(!isCreating) {
      setIsCreating(true);
      try {
        // Validate fields
        await schema.validate(values, { abortEarly: true });
        
        // Send request to create user
        await UserService.create(values);

        ToastService.success(t("pages.createUser.userCreated"));
        router.push('/');
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          ToastService.error(`${error.params?.label}: ${error.message}`);
        }
      } finally {
        setIsCreating(false);
      }
    } 
  } 
  
  return (
    <PrivateLayout title={titlePage}>
      <Card>
        <Card.Header>
          <div>
            <h3 className="font-medium mb-1">{t("pages.createUser.cardTitle")}</h3>
            <span className="text-xs">{t("pages.createUser.cardDescription")}</span>
          </div>
          <Link href="/users"></Link>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full px-2 mb-4 md:w-1/3">
              <Label className="px-1" htmlFor="name">{t("fields.name")} <span className='text-danger'>*</span></Label>

              <Input 
                name='name'
                id='name'
                type='text'
                value={values.name}
                onChange={(event) => setValues({ ...values, name: event.target.value })}
              />
            </div>
            <div className="w-full px-2 mb-4 md:w-1/3">
              <Label className="px-1" htmlFor="name">{t("fields.email")} <span className='text-danger'>*</span></Label>
              
              <Input 
                name='email'
                id='email'
                type='email'
                value={values.email}
                onChange={(event) => setValues({ ...values, email: event.target.value })}
              />
            </div>
            <div className="w-full px-2 mb-4 md:w-1/3">
              <Label className="px-1" htmlFor="password">{t("fields.password")} <span className='text-danger'>*</span></Label>
              
              <Input 
                name='password'
                id='password'
                type='password'
                value={values.password}
                onChange={(event) => setValues({ ...values, password: event.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end items-center gap-x-4 mt-4">
            <Button className='normal-case' size="sm" variant='primary' loading={isCreating} onClick={handleSubmit}>
              {t("pages.createUser.save")}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </PrivateLayout>
  )
}
