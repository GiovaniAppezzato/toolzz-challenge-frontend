import { useState } from 'react';
import Link from 'next/link'
import * as yup from "yup";
import { useTranslation } from 'react-i18next';
import useAuth from '@/hooks/useAuth';
import ToastService from '@/services/toast';
import PublicLayout from "@/components/layouts/PublicLayout";
import { Card, Button, Input, Label } from '@/components';
import i18n from '@/locales/i18n';
import translationsYup from '@/locales/yupMessages';

yup.setLocale(translationsYup);

const schema = yup.object().shape({
  password: yup.string().required().label(i18n.t("fields.password")),
  email: yup.string().email().required().label(i18n.t("fields.email")),
});

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: 'root@gmail.com',
    password: '123456'
  });

  const { t } = useTranslation();
  const { signIn } = useAuth();

  async function handleSubmit() {
    if(!loading) {
      setLoading(true);
      try {
        // Validate fields
        await schema.validate(values, { abortEarly: true });

        // Send request to sign in
        await signIn(values.email, values.password);
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          ToastService.error(`${error.params?.label}: ${error.message}`);
        } else {
          ToastService.error(t("pages.signIn.invalidCredentials"));
        }
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <PublicLayout>
      <Card className="w-full max-w-lg overflow-hidden">
        <Card.Body className="p-8 md:p-10">
          <div className="text-center">
            <h3 className="font-[600] text-lg dark:text-gray-300">
              {t("pages.signIn.title")}
            </h3>
            <p className="mt-1 mb-8 text-[13px] leading-normal text-gray-400">
              {t("pages.signIn.description")}
            </p>
          </div>

          <div>
            <Label className="px-1" htmlFor="email">{t("fields.email")} <span className='text-danger'>*</span></Label>

            <Input 
              name='email'
              id='email'
              type='email'
              value={values.email}
              onChange={(event) => setValues({ ...values, email: event.target.value })}
            />
          </div>

          <div className="mt-5">
            <Label className="px-1" htmlFor="password">{t("fields.password")} <span className='text-danger'>*</span></Label>

            <Input 
              name='password'
              id='password'
              type='password'
              value={values.password}
              onChange={(event) => setValues({ ...values, password: event.target.value })}
            />
          </div>

          <div className="flex justify-end items-center mt-6">
            <p className="text-xs">
              {t("pages.signIn.noAccount")}
              <Link href="/sign-up" className="text-primary font-medium hover:underline">
                {' '} {t("pages.signIn.doSignUp")}
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <Button className='normal-case w-full' variant='primary' loading={loading} onClick={handleSubmit}>
              {t("pages.signIn.access")}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </PublicLayout>
  )
}
