Установка библиотек и запуск тестового задания:
```shell
npm install

npm run test
```
Никакие дополнительные библиотеки не использовал.
Перед решением задачи, рассмотрел возможные клиентские форматы дат. 

Разбил их на 2 группы: 
- числовые;
- содержащие словесные обозначения месяцев;

Также разделил саму дату на 2 составляющие:   
- сама дата формата yyyy-mm-dd;
- и формат времени THH:MM:SS.XXX;

Ну еще там пришлось отдельно находить таймзону(+7:00).

Их нужно было привести к единому формату. Самый очевидный вариант - использовать регулярные выражения. 

Сначала из строки выдергиваю дату, прогоняя по различным возможным шаблонам, потом ищу время. Небольшие трудности были тут : 
- Если есть тайм зона в строке, ее нужно подставить, иначе должен стоять символ Z. Таймзону можно перепутать с обозначением часов и минут, поэтому я делал проверку на "+" результате от регулярки;
- Часы и минуты могли быть отделены от остальной части времени;

Итог: сторонние библиотеки отсутствуют, тк, я решил, что регулярки с этим справятся. Тесты проходятся. Сложность алгоритма O(n) 

*node v22.2.0*
