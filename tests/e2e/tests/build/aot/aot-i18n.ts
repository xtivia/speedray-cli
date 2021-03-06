import {sr} from '../../../utils/process';
import {expectFileToMatch, writeFile, createDir, appendToFile} from '../../../utils/fs';
import {expectToFail} from '../../../utils/utils';

export default function() {
  return Promise.resolve()
    .then(() => createDir('src/locale'))
    .then(() => writeFile('src/locale/messages.fr.xlf', `
      <?xml version="1.0" encoding="UTF-8" ?>
        <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
         <file source-language="en" datatype="plaintext" original="ng2.template">
           <body>
             <trans-unit id="8def8481e91291a52f9baa31cbdb313e6a6ca02b" datatype="html">
               <source>Hello i18n!</source>
               <target>Bonjour i18n!</target>
               <note priority="1" from="description">An introduction header for this sample</note>
             </trans-unit>
           </body>
         </file>
        </xliff>`))
    .then(() => appendToFile('src/app/app.component.html',
      '<h1 i18n="An introduction header for this sample">Hello i18n!</h1>'))
    .then(() => sr('build', '--aot', '--i18n-file', 'src/locale/messages.fr.xlf', '--i18n-format',
      'xlf', '--locale', 'fr'))
    .then(() => sr('build', '--aot', '--i18nFile', 'src/locale/messages.fr.xlf', '--i18nFormat',
      'xlf', '--locale', 'fr'))
    .then(() => expectFileToMatch('liferay/dist/main.*.bundle.js', /Bonjour i18n!/))
    .then(() => sr('build', '--aot'))
    .then(() => expectToFail(() => expectFileToMatch('liferay/dist/main.*.bundle.js', /Bonjour i18n!/)))
    .then(() => expectFileToMatch('liferay/dist/main.*.bundle.js', /Hello i18n!/));
}
