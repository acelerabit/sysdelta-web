import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs?.extend(utc);

export function formatDate(date: string) {
  const dateFormat = new Date(date);

  return new Intl.DateTimeFormat('pt-br').format(dateFormat);
}


export function formatToUTC(date: Date) {
  return dayjs(date).utc().format('DD/MM/YYYY');
}

export function formatDateWithHours(date: string) {
  const dateFormat = new Date(date);

  const dateDay = new Intl.DateTimeFormat('pt-br').format(dateFormat);

  const dateTime = new Intl.DateTimeFormat('pt-br', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(dateFormat);

  return `${dateDay} ás ${dateTime}`;
}